export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  category: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type CreatePostData = Omit<Post, 'id' | 'author' | 'authorId' | 'createdAt'> & {
  createdAt?: Date;
};

export type UpdatePostData = Partial<Omit<Post, 'id' | 'author' | 'authorId'>>;

export interface PostFormData {
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  excerpt: string;
  createdAt?: Date;
  updatedAt?: Date;
} 