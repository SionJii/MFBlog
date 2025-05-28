import { useState, useEffect } from 'react';
import { getAllPosts, getPostsByCategory } from '../firebase/posts';
import type { Post } from '../types/post';
import BlogPost from './BlogPost';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorMessage from './common/ErrorMessage';

interface PostListProps {
  selectedCategory?: string;
  searchQuery?: string;
  limit?: number;
}

const PostList = ({ selectedCategory, searchQuery = '', limit }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPosts = selectedCategory
          ? await getPostsByCategory(selectedCategory)
          : await getAllPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('게시물을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[200px]" />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={selectedCategory ? () => window.location.href = '/posts' : undefined}
        className="min-h-[200px]"
      />
    );
  }

  const filteredPosts = posts
    .filter(post => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
      );
    })
    .slice(0, limit);

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center p-8 min-w-[600px]">
        <p className="text-gray-600">게시물이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 min-w-[600px]">
      {filteredPosts.map((post) => (
        <BlogPost
          key={post.id}
          id={post.id}
          title={post.title}
          createdAt={post.createdAt || new Date()}
          excerpt={post.excerpt}
          author={post.author}
          imageUrl={post.imageUrl}
          category={post.category}
        />
      ))}
    </div>
  );
};

export default PostList; 