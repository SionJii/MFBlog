import { Link } from 'react-router-dom';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          회원가입 기능 개발 중
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          현재 회원가입 기능이 개발 중입니다.
          <br />
          개발자에게 문의하시려면 아래 이메일로 연락해 주세요.
        </p>
        <div className="mt-4 text-center">
          <a
            href="mailto:jww019054@gmail.com"
            className="text-blue-600 hover:text-blue-500"
          >
            jww019054@gmail.com
          </a>
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 