type Conversation = {
  id: string
  customer_name: string
  message: string
}

type ConversationsPanelProps = {
  conversations: Conversation[]
}

export default function ConversationsPanel({
  conversations
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

            <p className="font-semibold text-lg mb-2">
              {conversation.customer_name}
            </p>

            <p className="text-gray-300">
              {conversation.message}
            </p>

          </div>

        ))}

      </div>

    </div>
  )
}