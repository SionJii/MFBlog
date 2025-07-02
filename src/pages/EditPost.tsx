import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostEditor from '../components/PostEditor';
import { getPost, updatePost } from '../firebase/posts';
import type { Post } from '../types/post';
import type { Category } from '../constants/categories';

const EditPost = () => {
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

  const handleSave = async (postId: string) => {
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center p-8">
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">게시물 수정</h1>
      <PostEditor
        initialPost={post}
        onSave={handleSave}
        mode="edit"
      />
    </div>
  );
};

export default EditPost;