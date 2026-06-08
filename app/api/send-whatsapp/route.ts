import twilio from 'twilio'

const client = twilio(

  process.env.TWILIO_ACCOUNT_SID,

  process.env.TWILIO_AUTH_TOKEN

)

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const {
      customer_name,
      response
    } = body

    await client.messages.create({

      from:
        process.env.TWILIO_WHATSAPP_NUMBER,

      to:
        'whatsapp:+256702371998',

      body:
`AI Workflow Response

Customer:
${customer_name}

${response}`

    })

    return Response.json({
      success: true
    })

  } catch (error: any) {

    return Response.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
