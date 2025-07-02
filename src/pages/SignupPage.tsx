import { Link } from 'react-router-dom';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          회원가입은 초대 전용입니다
        </h2>
        <p className="mt-4 text-center text-sm text-gray-600">
          현재 MF Blog는 초대받은 사용자만 회원가입이 가능합니다.<br />
          가입을 원하시면 아래 이메일로 문의해 주세요.
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