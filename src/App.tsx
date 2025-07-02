import { Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import ErrorBoundary from './components/common/ErrorBoundary'
import Home from './pages/Home'
import About from './pages/About'
import NewPost from './pages/NewPost'
import Posts from './pages/Posts'
import PostDetail from './pages/PostDetail'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SetNicknamePage from './pages/SetNicknamePage'
import EditPost from './pages/EditPost'
import SetNickname from './components/SetNickname'
import Header from './components/Header'

// 로그인이 필요한 페이지를 위한 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <PrivateRoute>{children}</PrivateRoute>;
};

const AppContent = () => {
  const { user, userProfile } = useAuth();

  // 닉네임이 없는 경우 닉네임 설정 폼 표시
  if (user && (!userProfile || !userProfile.nickname)) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SetNickname user={user} onComplete={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col bg-gray-50 pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/new" element={
            <ProtectedRoute>
              <NewPost />
            </ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/set-nickname" element={<SetNicknamePage />} />
        </Routes>
      </main>
      <footer className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            © 2024 MF Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
