import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostList from '../components/PostList';
import Sidebar from '../components/Sidebar';

const Posts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const selectedCategory = searchParams.get('category') || '';

  const handleCategorySelect = (category: string) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // URL 파라미터가 변경될 때마다 검색어 초기화
  useEffect(() => {
    setSearchQuery('');
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        <div className="flex-1">
          <PostList
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
        <div className="w-64 flex-shrink-0">
          <Sidebar
            onCategorySelect={handleCategorySelect}
            onSearch={handleSearch}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default Posts; 