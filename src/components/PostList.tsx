import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, getPostsByCategory } from '../firebase/posts';
import type { Post } from '../types/post';

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
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 mb-4">{error}</p>
        {selectedCategory && (
          <Link to="/posts" className="text-blue-600 hover:text-blue-800">
            전체 게시물로 돌아가기
          </Link>
        )}
      </div>
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
      <div className="text-center p-4">
        <p className="text-gray-600">
          {searchQuery
            ? '검색 결과가 없습니다.'
            : selectedCategory
            ? '해당 카테고리의 게시물이 없습니다.'
            : '게시물이 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredPosts.map(post => (
        <article
          key={post.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <Link to={`/post/${post.id}`} className="block">
            {post.imageUrl && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {post.content.replace(/[#*`]/g, '')}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <span>{post.author}</span>
                  <span>•</span>
                  <time>
                    {post.date instanceof Date
                      ? post.date.toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : '날짜 정보 없음'}
                  </time>
                </div>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                  {post.category}
                </span>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
};

export default PostList; 