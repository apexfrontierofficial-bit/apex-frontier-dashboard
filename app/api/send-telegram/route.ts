export async function POST(req: Request) {

  try {

    const body = await req.json()

    const {
      customer_name,
      message,
      action
    } = body

    const token =
      process.env.TELEGRAM_BOT_TOKEN

    const chatId =
      process.env.TELEGRAM_CHAT_ID

    await fetch(

      `https://api.telegram.org/bot${token}/sendMessage`,

      {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({

          chat_id: chatId,

          text: `
🚨 URGENT AI ALERT

Customer:
${customer_name}

Message:
${message}

Recommended Action:
${action}
          `

        })

      }

    )

    return Response.json({
      success: true
    })

  } catch (error: any) {

    return Response.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}