export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  excerpt: string;
  author: string;
  authorId: string;
  imageUrl?: string;
} 