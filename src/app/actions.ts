"use server";

import { supabase } from "@/lib/supabase";
import OpenAI from "openai";
import { decode } from "base64-arraybuffer";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function createCompletion(prompt: string): Promise<any> {
  if (!prompt) {
    return { error: "prompt is required." };
  }

  const { userId } = auth();
  if (!userId) {
    return { error: "User is not logged in" };
  }

  // generate blog post using openai
  const messages: any = [
    {
      role: "user",
      content: `Write  blog post around 200 words about the following topics:`,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages,
  });

  const content = completion?.choices?.[0]?.message?.content;

  if (!content) {
    return { error: "unable to generate the blog content." };
  }

  // generate an image using openai
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Generate an image for a blog post about "${prompt}"`,
    n: 1,
    size: "1024x1792",
    response_format: "b64_json",
  });

  const imageName = `blog-${Date.now()}`;
  const imageData = image?.data?.[0].b64_json as string;

  if (!imageData) {
    return { error: "Unable to generate the blog image." };
  }

  // upload the image to supabase storage
  const { data, error } = await supabase.storage
    .from("blogs")
    .upload(imageName, decode(imageData), {
      contentType: "image/png",
    });

  if (error) {
    return { error: "Unable to upload the blog image to Storage." };
  }

  const path = data?.path;

  const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/imageStorage/${path}`;

  // create anew blog post in supabase
  const { data: blog, error: blogError } = await supabase
    .from("blogs")
    .insert([{ title: prompt, content, imageUrl, userId }])
    .select();

  if (blogError) {
    return { error: "Unable to insert the blog into the database." };
  }

  const blogId = blog?.[0]?.id;

  revalidatePath("/");

  redirect(`/blog/${blogId}`);
}
