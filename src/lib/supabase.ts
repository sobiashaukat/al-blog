import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SERVICEROLE_KEY as string

export const supabase = createClient(supabaseUrl,supabaseKey)

export async function getBlogById(id:number){
    const {data,error} = await supabase
    .form('blogs')
    .select()
    .eq('id', id)
    .single()

    return data
}
 export async function getAllBlogs() {
    const {data,error} = await supabase
    .form('blogs')
    .select()
    .order('created_at',{ascending:false})

    return data
 }