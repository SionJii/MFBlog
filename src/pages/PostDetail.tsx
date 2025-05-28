import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { getPost, deletePost } from '../firebase/posts';
import { auth } from '../firebase/config';
import type { Post } from '../types/post';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setIsDeleting(true);
      await deletePost(id);
      navigate('/posts');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('게시물 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px] mt-8" />;
  }

  if (error || !post) {
    return (
      <ErrorMessage
        message={error || '게시물을 찾을 수 없습니다.'}
        onRetry={() => navigate('/posts')}
        className="min-h-[400px] mt-8"
      />
    );
  }

  const isAuthor = auth.currentUser?.uid === post.authorId;

  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <article className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden mt-8 mb-8">
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{post.author}</span>
                <span className="text-gray-300">•</span>
                <time className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </time>
              </div>
              {isAuthor && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/edit/${post.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="prose max-w-none overflow-y-auto max-h-[calc(100vh-200px)]">
              <div data-color-mode="light">
                <MDEditor.Markdown source={post.content} />
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail; 