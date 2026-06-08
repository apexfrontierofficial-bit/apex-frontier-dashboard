import { createClient } from '@supabase/supabase-js'

const supabase = createClient(

  process.env.NEXT_PUBLIC_SUPABASE_URL!,

  process.env.SUPABASE_SERVICE_ROLE_KEY!

)

export async function POST(req: Request) {

  try {

    const body =
      await req.formData()

    const message =
      body.get('Body')

    const from =
      body.get('From')

    console.log('WHATSAPP MESSAGE:', message)

    const { error } = await supabase
      .from('conversations')
      .insert([{

        customer_name:
          from,

        message:
          message

      }])

    if (error) {

      console.log(error)

    }

    return new Response('OK', {
      status: 200
    })

  } catch (error) {

    console.log(error)

    return new Response(
      'Webhook Error',
      {
        status: 500
      }
    )
  }
}
