export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  date: Date;
  excerpt: string;
  author: string;
  authorId: string;
  imageUrl?: string;
} 