import type { CategoryKey } from "@/lib/categories";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  tags: string[];
  category: CategoryKey;
  created_at: string;
  published: boolean;
}
