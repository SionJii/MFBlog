import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';

interface SidebarProps {
  onCategorySelect: (category: string) => void;
  onSearch: (query: string) => void;
}

const Sidebar = ({ onCategorySelect, onSearch }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="게시물 검색..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          검색
        </button>
      </form>

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">카테고리</h3>
        <div className="space-y-1">
          <button
            onClick={() => onCategorySelect('')}
            className={`w-full text-left px-3 py-2 rounded-md ${
              !location.search.includes('category=')
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-gray-50'
            }`}
          >
            전체
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onCategorySelect(category)}
              className={`w-full text-left px-3 py-2 rounded-md ${
                location.search.includes(`category=${category}`)
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate('/new')}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        새 글 작성
      </button>
    </div>
  );
};

export default Sidebar; 