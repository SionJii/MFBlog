import type { Category } from '../constants/categories';

export interface BasePost {
  title: string;
  content: string;
  category: Category;
  excerpt: string;
  imageUrl?: string;
}

export interface Post extends BasePost {
  id: string;
  authorId: string;
  author: string;
  date: Date;
}

export interface PostFormData extends BasePost {
  id?: string;
} 