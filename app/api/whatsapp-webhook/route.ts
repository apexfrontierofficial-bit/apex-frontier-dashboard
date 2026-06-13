import { supabase } from '../../../lib/supabase'

export async function POST(req: Request) {

  try {

    const formData = await req.formData()

    console.log('FORM DATA RECEIVED')

    const message =
      formData.get('Body')

    const sender =
      formData.get('ProfileName')

    console.log('MESSAGE:', message)
    console.log('SENDER:', sender)

    const { data, error } = await supabase
      .from('conversations')
      .insert([

        {
          customer_name:
            sender || 'Unknown',

          message:
            message || 'Empty message'
        }

      ])
      .select()

    console.log('SUPABASE DATA:', data)
    console.log('SUPABASE ERROR:', error)

    if (error) {

      return Response.json({
        error: error.message
      })
    }

    return new Response('OK', {
      status: 200
    })

  } catch (error: any) {

    console.log('WEBHOOK ERROR:', error)

    return Response.json({
      error: error.message
    })
  }
}