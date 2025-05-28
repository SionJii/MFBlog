import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
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
import { useEffect, useState } from 'react'
import { auth } from './firebase/config'
import type { User } from 'firebase/auth'
import { getUserProfile } from './firebase/users'
import type { UserProfile } from './firebase/users'
import SetNickname from './components/SetNickname'
import Header from './components/Header'

// 로그인이 필요한 페이지를 위한 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = auth.currentUser;

  if (!user) {
    return <PrivateRoute />;
  }

  return <>{children}</>;
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showNicknameForm, setShowNicknameForm] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const profile = await getUserProfile(user);
        setUserProfile(profile);
        setShowNicknameForm(!profile);
      } else {
        setUserProfile(null);
        setShowNicknameForm(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNicknameComplete = async () => {
    if (user) {
      const profile = await getUserProfile(user);
      setUserProfile(profile);
      setShowNicknameForm(false);
    }
  };

  if (showNicknameForm && user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SetNickname user={user} onComplete={handleNicknameComplete} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
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
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
