import OpenAI from 'openai'

export async function POST(req: Request) {

  try {

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({
        error: 'OPENAI_API_KEY is not configured'
      }, {
        status: 500
      })
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const body = await req.json()

    const message = body.message

    const completion = await client.chat.completions.create({

      model: 'gpt-4.1-mini',

      messages: [

        {
          role: 'system',
          content: `
You are a business message classifier.


You are an AI operations assistant.

Analyze the customer message.


{
  "category": "Sales",
  "action": "Assign admissions officer",
  "response": "Thank you for your interest. Our admissions team will contact you shortly."
}


Possible categories:

- Sales
- Support
- Billing
- Urgent

Possible actions:

Generate a short professional customer response.

- Assign admissions officer
- Assign support team
- Escalate finance issue
- Escalate immediately
- Send payment instructions
- Request more information
          `
        },

        {
          role: 'user',
          content: message
        }

      ]

    })

   
const result = JSON.parse(
  completion.choices[0].message.content || '{}'
)

return Response.json(result)



  } catch (error: any) {

    console.log(error)

    return Response.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500
    })

  }
}
