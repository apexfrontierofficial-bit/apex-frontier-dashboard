type Conversation = {
  id: string
  customer_name: string
  message: string
  category?: string
  status?: string
  action?: string
  response?: string
  email_sent?: boolean
}

type ConversationsPanelProps = {
  conversations: Conversation[]
  updateConversationStatus: (
    id: string,
    status: string
  ) => void
}

export default function ConversationsPanel({
  conversations,
  updateConversationStatus
}: ConversationsPanelProps) {

  return (

    <div>

      <h2 className="text-3xl font-semibold mb-6">
        Conversations
      </h2>

      <div className="space-y-4">

        {conversations.map((conversation) => (

          <div
            key={conversation.id}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
          >

            <div className="flex items-center justify-between mb-3">

              <div>

                <p className="font-semibold text-lg">
                  {conversation.customer_name}
                </p>

               <div className="flex gap-3 mt-1">

  <p className="text-sm text-gray-400">
    {conversation.category || 'Unclassified'}
  </p>

  <p className="text-sm text-blue-400 font-semibold">
    {conversation.status || 'New'}
  </p>

</div>

              </div>

              


<div className="flex gap-2">

  <button
    onClick={() =>
      updateConversationStatus(
        conversation.id,
        'In Progress'
      )
    }
    className="bg-yellow-500 px-3 py-1 rounded-lg text-sm font-semibold"
  >
    In Progress
  </button>

  <button
    onClick={() =>
      updateConversationStatus(
        conversation.id,
        'Closed'
      )
    }
    className="bg-green-600 px-3 py-1 rounded-lg text-sm font-semibold"
  >
    Closed
  </button>

  <button
    onClick={() =>
      updateConversationStatus(
        conversation.id,
        'Escalated'
      )
    }
    className="bg-red-600 px-3 py-1 rounded-lg text-sm font-semibold"
  >
    Escalate
  </button>

</div>


            </div>

            
<p className="text-gray-300 mb-3">
  {conversation.message}
</p>

<div className="bg-black border border-gray-700 rounded-xl p-3">

  <p className="text-xs text-gray-500 mb-1">
    AI Recommended Action
  </p>

  <p className="text-sm text-green-400 font-semibold">
    {conversation.action || 'No recommendation'}
  </p>

</div> 
<div className="bg-gray-950 border border-gray-800 rounded-xl p-3 mt-3">

  <p className="text-xs text-gray-500 mb-1">
    AI Auto Response
  </p>

  <p className="text-sm text-blue-400">
    {conversation.response || 'No response'}
  </p>

</div>



          </div>

        ))}

      </div>

    </div>
  )
}