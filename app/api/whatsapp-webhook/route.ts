import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {

  try {

    const body =
      await req.formData()

    const message =
      body.get('Body')

    const from =
      body.get('From')

    console.log('WHATSAPP MESSAGE:', message)
    console.log('FROM:', from)

    await supabase
      .from('conversations')
      .insert([{

        customer_name:
          from,

        message:
          message

      }])

    return new Response('OK', {
      status: 200
    })

  } catch (error: any) {

    console.log(error)

    return new Response(
      error instanceof Error ? error.message : 'Unknown error'
      {
        status: 500
      }
    )
  }
}
