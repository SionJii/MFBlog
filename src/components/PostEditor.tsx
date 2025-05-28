import { useState, useCallback, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { createPost, updatePost, uploadImage } from '../firebase/posts';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { CATEGORIES } from '../constants/categories';
import type { Post } from '../types/post';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorMessage from './common/ErrorMessage';

interface PostEditorProps {
  onSave?: (postId: string) => void;
  initialPost?: Post;
  mode?: 'create' | 'edit';
}

const PostEditor = ({ onSave, initialPost, mode = 'create' }: PostEditorProps) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [category, setCategory] = useState(initialPost?.category || CATEGORIES[0]);
  const [imageUrl, setImageUrl] = useState(initialPost?.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title);
      setContent(initialPost.content);
      setCategory(initialPost.category);
      setImageUrl(initialPost.imageUrl || '');
    }
  }, [initialPost]);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      setImageUrl(url);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('이미지 업로드에 실패했습니다.');
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const postData = {
        title: title.trim(),
        content: content,
        category,
        excerpt: content.slice(0, 150),
        imageUrl: imageUrl || undefined
      };

      if (mode === 'edit' && initialPost) {
        await updatePost(initialPost.id, postData);
        if (onSave) {
          onSave(initialPost.id);
        } else {
          navigate(`/post/${initialPost.id}`);
        }
      } else {
        const post = await createPost(postData);
        if (onSave) {
          onSave(post.id);
        } else {
          navigate(`/post/${post.id}`);
        }
      }
    } catch (err: any) {
      console.error('Error saving post:', err);
      if (err.message === '닉네임을 먼저 설정해주세요.') {
        navigate('/set-nickname');
      } else {
        setError('게시물 저장에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <ErrorMessage
          message={error}
          className="mb-4"
        />
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          제목
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="게시물 제목을 입력하세요"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          카테고리
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          대표 이미지
        </label>
        <div className="flex items-center space-x-4">
          {imageUrl && (
            <div className="relative w-32 h-32">
              <img
                src={imageUrl}
                alt="대표 이미지"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => setImageUrl('')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(file);
                }
              }}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {isUploading && (
              <div className="mt-2">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          내용
        </label>
        <div data-color-mode="light">
          <MDEditor
            value={content}
            onChange={(value) => setContent(value || '')}
            height={400}
            preview="edit"
            enableScroll={true}
            textareaProps={{
              placeholder: '게시물 내용을 입력하세요',
            }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading || isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? '저장 중...' : mode === 'edit' ? '수정하기' : '저장하기'}
        </button>
      </div>
    </div>
  );
};

export default PostEditor; 