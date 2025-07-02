import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../firebase/posts';
import type { Post } from '../types/post';
import type { Category } from '../constants/categories';
import BlogPost from './BlogPost';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorMessage from './common/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';

interface PostListProps {
  selectedCategory?: string;
  searchQuery?: string;
  limit?: number;
}

const PostList = ({ selectedCategory, searchQuery = '', limit }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // 게시물 데이터 가져오기
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // 카테고리 값이 있으면 서버 필터링, 없으면 전체
      const fetchedPosts = await getPosts(selectedCategory as Category | undefined);
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('게시물을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 게시물 필터링 및 정렬 (검색어만 클라이언트 필터)
  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => {
        const matchesSearch = !searchQuery || 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }, [posts, searchQuery, limit]);

  // 새 게시물 작성 페이지로 이동
  const handleNewPost = useCallback(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/new-post');
  }, [navigate, user]);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchPosts}
        className="min-h-[400px]"
      />
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">게시물이 없습니다.</p>
        <button
          onClick={handleNewPost}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          첫 게시물 작성하기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {filteredPosts.map(post => (
        <BlogPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;