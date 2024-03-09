
import Form from '@/components/form'
import { CardContent, Card} from '@/components/ui/card';
import Image from 'next/image'

import { formatDate } from '@/lib/utils'
import { getAllBlogs } from '@/lib/supabase'
import Link from 'next/link';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from 'react';

export const maxDuration= 60



export default  async function Home() {
  const blogs = await getAllBlogs()
  return (

    <section className="py-24">
      <div className="container">
       <Form />

       <div className='mt-44'>
        <h2 className='text-xl font-semibold leading-none tracking-tight'>
           Recent blogs
           </h2>
           <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {blogs?.map((blog: { id: Key | null | undefined; imageUrl: string | StaticImport; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; created_at: any; }) => (
              <Card key={blog.id} className='overflow-hidden'>
                <CardContent className='p-0'>
                  <Link href={`/blog/${blog.id}`} key={blog.id}>
                    <Image
                    alt=''
                    src={blog.imageUrl}
                    width={200}
                    height={200}
                    className='w-full'
                    />

                    <div className='px-4 pb-3 pt-2'>
                      <h3 className='font-medium'>{blog.title}</h3>
                      <p className='text-xs text-grey-600'>
                        {formatDate(blog.created_at)}
                      </p>
                    </div>


                  </Link>
                </CardContent>
              </Card>
            ))}

           </div>
       
       </div>

      </div>
    </section>
  
  );
}
