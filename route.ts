import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {

  const body = await req.json()

  const message = body.message

  const completion = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: `
You are a message classifier.

Return ONLY one category:
- Sales
- Support
- Billing
- Urgent
`
      },
      {
        role: 'user',
        content: message
      }
    ]
  })

  return Response.json({
    category: completion.choices[0].message.content
  })
}