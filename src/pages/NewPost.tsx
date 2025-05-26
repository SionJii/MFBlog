import { useNavigate } from 'react-router-dom';
import PostEditor from '../components/PostEditor';

const NewPost = () => {
  const navigate = useNavigate();

  const handleSave = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">새 글 작성</h1>
      <PostEditor onSave={handleSave} />
    </div>
  );
};

export default NewPost; 