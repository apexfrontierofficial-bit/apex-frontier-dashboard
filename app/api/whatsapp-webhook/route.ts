import { supabaseAdmin } from '../../../lib/supabase-admin'

export async function POST(req: Request) {

  try {

    const formData = await req.formData()

    const message =
      formData.get('Body')

    const sender =
      formData.get('ProfileName')

    console.log('MESSAGE:', message)

    const { data, error } =
      await supabaseAdmin
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

    console.log(data)
    console.log(error)

    return new Response('OK', {
      status: 200
    })

  } catch (error: any) {

    console.log(error)

    return Response.json({
      error: error.message
    })
  }
}