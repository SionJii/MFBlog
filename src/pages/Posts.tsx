import { useState } from 'react';
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          />
        </div>
      </div>
    </div>
  );
};

export default Posts; 