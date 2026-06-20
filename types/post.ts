export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  tags: string[];
  created_at: string;
  published: boolean;
}
