import { useNavigate } from 'react-router-dom';
import SetNickname from '../components/SetNickname';
import { auth } from '../firebase/config';

const SetNicknamePage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleComplete = () => {
    navigate('/posts');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">닉네임 설정</h1>
        <SetNickname user={user} onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default SetNicknamePage; 