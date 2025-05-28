import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, deletePost } from '../firebase/posts';
import { auth } from '../firebase/config';
import type { Post } from '../types/post';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import MDEditor from '@uiw/react-md-editor';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const fetchedPost = await getPost(id);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError('게시물을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('게시물을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) return;

    try {
      await deletePost(id);
      navigate('/posts');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('게시물 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  if (error || !post) {
    return (
      <ErrorMessage
        message={error || '게시물을 찾을 수 없습니다.'}
        onRetry={() => navigate('/posts')}
        className="min-h-[400px]"
      />
    );
  }

  const isAuthor = auth.currentUser?.uid === post.authorId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="prose lg:prose-xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>{post.author}</span>
              <span>•</span>
              <time dateTime={post.createdAt?.toISOString()}>
                {post.createdAt?.toLocaleDateString() || '날짜 없음'}
              </time>
              <span>•</span>
              <span>{post.category}</span>
            </div>
            {isAuthor && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(`/edit/${post.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </header>

        {post.imageUrl && (
          <div className="mb-8">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div data-color-mode="light" className="mb-8">
          <MDEditor.Markdown source={post.content} />
        </div>
      </article>
    </div>
  );
};

export default PostDetail; 