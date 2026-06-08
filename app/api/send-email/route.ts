import { Resend } from 'resend'

const resend = new Resend(
  process.env.RESEND_API_KEY
)

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const {
      customer_name,
      response
    } = body

    const data = await resend.emails.send({

      from: 'onboarding@resend.dev',

      to: 'apex.frontier.official@gmail.com',

      subject: `New AI Workflow Response`,

      html: `
        <h2>Customer: ${customer_name}</h2>

        <p>${response}</p>
      `
    })

    return Response.json(data)

  } catch (error: any) {

    return Response.json({
      error: error.message
    })
  }
}

