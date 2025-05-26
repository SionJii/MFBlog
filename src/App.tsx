import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import NewPost from './pages/NewPost'
import Posts from './pages/Posts'
import PostDetail from './pages/PostDetail'
import LoginPage from './pages/LoginPage'
import SetNicknamePage from './pages/SetNicknamePage'
import EditPost from './pages/EditPost'
import { useEffect, useState } from 'react'
import { auth } from './firebase/config'
import type { User } from 'firebase/auth'
import { getUserProfile } from './firebase/users'
import type { UserProfile } from './firebase/users'
import SetNickname from './components/SetNickname'

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
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">MF Blog</h1>
              <nav>
                <ul className="flex items-center space-x-4">
                  <li>
                    <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                  </li>
                  <li>
                    <Link to="/posts" className="text-gray-600 hover:text-gray-900">게시물</Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                  </li>
                  {user ? (
                    <>
                      <li>
                        <Link 
                          to="/new" 
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          글 작성
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => auth.signOut()}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          로그아웃
                        </button>
                      </li>
                      {userProfile && (
                        <li className="text-gray-600">
                          {userProfile.nickname}
                        </li>
                      )}
                    </>
                  ) : (
                    <li>
                      <Link 
                        to="/login" 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        로그인
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/new" element={<NewPost />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/set-nickname" element={<SetNicknamePage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white shadow-sm mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-gray-500 text-sm">
              © 2024 MF Blog. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
