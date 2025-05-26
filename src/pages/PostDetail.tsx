import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { getPost, deletePost } from '../firebase/posts';
import { auth } from '../firebase/config';
import type { Post } from '../types/post';

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
    return (
      <div className="flex justify-center items-center min-h-[400px] mt-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center p-8 mt-8">
        <p className="text-red-600 mb-4">{error || '게시물을 찾을 수 없습니다.'}</p>
        <button
          onClick={() => navigate('/posts')}
          className="text-blue-600 hover:text-blue-800"
        >
          게시물 목록으로 돌아가기
        </button>
      </div>
    );
  }

  const isAuthor = auth.currentUser?.uid === post.authorId;

  return (
    <div className="mt-8">
      <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
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
          <header className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
              {isAuthor && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/edit/${post.id}`)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>{post.author}</span>
              <span>•</span>
              <time>
                {post.date instanceof Date
                  ? post.date.toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : '날짜 정보 없음'}
              </time>
              <span>•</span>
              <span className="px-2 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                {post.category}
              </span>
            </div>
          </header>

          <div className="prose max-w-none">
            <div data-color-mode="light">
              <MDEditor.Markdown source={post.content} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail; 