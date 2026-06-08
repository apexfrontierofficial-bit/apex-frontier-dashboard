'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import DashboardCard from '../components/DashboardCard'
import ConversationsPanel from '../components/ConversationsPanel'

type School = {
  id: string
  school_name: string
}

type Conversation = {
  id: string
  customer_name: string
  message: string
  category?: string
  status?: string
  action?: string
  response?: string
  email_sent?: boolean
telegram_sent?: boolean
}

export default function Home() {

  const [schoolName, setSchoolName] = useState('')
  const [schools, setSchools] = useState<School[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activePage, setActivePage] = useState('Dashboard')
  const [selectedFilter, setSelectedFilter] =
  useState('All')


  async function fetchSchools() {

    const { data } = await supabase
      .from('schools')
      .select('*')

    if (data) {
      setSchools(data)
    }
  }
 
  async function classifyConversation(
  message: string
) {

  try {

    const response = await fetch(
      '/api/classify',
      {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          message
        })

      }
    )

    const data = await response.json()

    
return {

  category:
    data.category || 'Unknown',

  action:
    data.action || 'No action',

  response:
    data.response || 'No response'

}

  } catch (error) {

    console.log(error)

    return 'Error'
  }
}

async function sendAutomatedEmail(
  customer_name: string,
  response: string
) {

  try {

    await fetch('/api/send-email', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({

        customer_name,

        response

      })

    })

  } catch (error) {

    console.log(error)
    
  }
}

  async function fetchConversations() {

    const { data } = await supabase
      .from('conversations')
      .select('*')

    if (data) {
      const formattedConversations = await Promise.all(
        data.map(async (conversation) => {
          const aiResult = await classifyConversation(conversation.message)
          
if (!conversation.email_sent) {

  await sendAutomatedEmail(

    conversation.customer_name,

    aiResult.response

  )

  await supabase
    .from('conversations')
    .update({
      email_sent: true
    })
    .eq('id', conversation.id)

}
if (

  aiResult.category === 'Urgent' &&

  !conversation.telegram_sent

) {

  await fetch('/api/send-telegram', {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({

      customer_name:
        conversation.customer_name,

      message:
        conversation.message,

      action:
        aiResult.action

    })

  })

  await supabase
    .from('conversations')
    .update({
      telegram_sent: true
    })
    .eq('id', conversation.id)

}


await fetch('/api/send-whatsapp', {

  method: 'POST',

  headers: {
    'Content-Type': 'application/json'
  },

  body: JSON.stringify({

    customer_name:
      conversation.customer_name,

    response:
      aiResult.response

  })

})

          return {
            ...conversation,
            category: aiResult.category,
            action: aiResult.action,
            response: aiResult.response,
            status:

  aiResult.category === 'Urgent'

    ? 'Escalated'

    : conversation.status || 'New'

          }
        })
      )

      setConversations(formattedConversations)
    }
  }


  async function addSchool() {

    if (!schoolName) return

    await supabase
      .from('schools')
      .insert([
        {
          school_name: schoolName
        }
      ])

    setSchoolName('')

    fetchSchools()
  }

  async function deleteSchool(id: string) {

    await supabase
      .from('schools')
      .delete()
      .eq('id', id)

    fetchSchools()
  }

  async function updateConversationStatus(
    id: string,
    status: string
  ) {

    await supabase
      .from('conversations')
      .update({ status })
      .eq('id', id)

    fetchConversations()
  }



const filteredConversations =
  selectedFilter === 'All'

    ? conversations

    : conversations.filter(
        (conversation) =>

          conversation.category ===
            selectedFilter ||

          conversation.status ===
            selectedFilter
      )

const urgentCount = conversations.filter(
  (conversation) =>
    conversation.category === 'Urgent'
).length

const inProgressCount = conversations.filter(
  (conversation) =>
    conversation.status === 'In Progress'
).length

const closedCount = conversations.filter(
  (conversation) =>
    conversation.status === 'Closed'
).length

  
useEffect(() => {

  async function loadData() {

    await fetchSchools()
    await fetchConversations()

  }

  loadData()

}, [])


  return (

    <main className="flex bg-black min-h-screen text-white">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 p-10">

        <h1 className="text-5xl font-bold mb-8">
          {activePage}
        </h1>

        <div className="grid grid-cols-3 gap-6 mb-10">

          
<DashboardCard
  title="Schools"
  value={schools.length}
/>

<DashboardCard
  title="Conversations"
  value={conversations.length}
/>

<DashboardCard
  title="Urgent"
  value={urgentCount}
/>

<DashboardCard
  title="In Progress"
  value={inProgressCount}
/>

<DashboardCard
  title="Closed"
  value={closedCount}
/>


        </div>

        {activePage === 'Schools' && (

          <div>

            <div className="flex gap-4 mb-10">

              <input
                type="text"
                placeholder="Enter school name"
                value={schoolName}
                onChange={(e) =>
                  setSchoolName(e.target.value)
                }
                className="px-4 py-3 rounded-lg text-black w-96"
              />

              <button
                onClick={addSchool}
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
              >
                Add School
              </button>

            </div>

            <div className="space-y-4">

              {schools.map((school) => (

                <div
                  key={school.id}
                  className="bg-gray-900 p-5 rounded-xl border border-gray-800"
                >

                  <div className="flex items-center justify-between">

                    <p className="text-xl">
                      {school.school_name}
                    </p>

                    <button
                      onClick={() =>
                        deleteSchool(school.id)
                      }
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

        
<div className="flex gap-3 mb-6">

  {[
    'All',
    'Sales',
    'Support',
    'Billing',
    'Urgent',
    'New',
    'In Progress',
    'Closed',
    'Escalated'
  ].map((filter) => (

    <button
      key={filter}
      onClick={() =>
        setSelectedFilter(filter)
      }
      className={`px-4 py-2 rounded-lg font-semibold ${
        selectedFilter === filter
          ? 'bg-white text-black'
          : 'bg-gray-800 text-white'
      }`}
    >
      {filter}
    </button>

  ))}

</div>

        {activePage === 'Conversations' && (

          <ConversationsPanel
            conversations={filteredConversations}
            updateConversationStatus={
              updateConversationStatus
            }
          />

        )}

      </div>

    </main>
  )
}

