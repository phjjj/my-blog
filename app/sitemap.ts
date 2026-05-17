import type { MetadataRoute } from "next";
import { getPosts } from "@/utils/supabase";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL as string;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/post/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...postEntries,
  ];
}
