import { Link } from 'react-router-dom';
import PostList from '../components/PostList';
import Sidebar from '../components/Sidebar';
import { CATEGORIES } from '../constants/categories';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          MF Blog에 오신 것을 환영합니다
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          게임, 취미, 일상 등 다양한 주제의 글을 작성하고 공유해보세요.
        </p>
        <Link
          to="/posts"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          게시물 보기
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">블로그 소개</h2>
          <p className="text-gray-600">
            MF Blog는 게임, 취미, 일상, 프로젝트 등 다양한 주제의 글을 공유하는 공간입니다.
            개발자로서의 경험과 일상을 기록하고, 다른 사람들과 함께 성장하는 것을 목표로 합니다.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">주요 카테고리</h2>
          <ul className="space-y-2 text-gray-600">
            {CATEGORIES.map((category) => (
              <li key={category} className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                <span>{category}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">최근 게시물</h2>
        <PostList limit={3} />
      </div>
    </div>
  );
};

export default Home; 