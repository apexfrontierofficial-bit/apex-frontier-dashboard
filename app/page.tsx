'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import DashboardCard from '../components/DashboardCard'
import ConversationsPanel from '../components/ConversationsPanel'

export default function Home() {

  const [schoolName, setSchoolName] = useState('')
  const [schools, setSchools] = useState<any[]>([])
  const [conversations, setConversations] = useState<any[]>([])
  const [activePage, setActivePage] = useState('Dashboard')

  async function fetchSchools() {

    const { data } = await supabase
      .from('schools')
      .select('*')

    if (data) {
      setSchools(data)
    }
  }

  async function fetchConversations() {

    const { data } = await supabase
      .from('conversations')
      .select('*')

    if (data) {
      setConversations(data)
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

    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id)

    console.log('DELETE ERROR:', error)

    fetchSchools()
  }

  useEffect(() => {
    fetchSchools()
    fetchConversations()
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

        {/* Metrics */}

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
            title="Workflows"
            value={0}
          />

        </div>

        {/* Add School */}

        {activePage === 'Schools' && (

          <>

            <div className="flex gap-4 mb-10">

              <input
                type="text"
                placeholder="Enter school name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="px-4 py-3 rounded-lg text-black w-96"
              />

              <button
                onClick={addSchool}
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
              >
                Add School
              </button>

            </div>

            <div>

              <h2 className="text-3xl font-semibold mb-6">
                Schools
              </h2>

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
                        onClick={() => deleteSchool(school.id)}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </>

        )}

        {activePage === 'Conversations' && (

          <ConversationsPanel
            conversations={conversations}
          />

        )}

      </div>

    </main>

  )
}