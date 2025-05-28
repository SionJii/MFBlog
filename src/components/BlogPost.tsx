import { memo } from 'react';
import { Link } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { formatDate } from '../utils/dateUtils';
import type { Post } from '../types/post';

interface BlogPostProps {
  post: Post;
}

const BlogPost = memo(({ post }: BlogPostProps) => {
  const { id, title, excerpt, author, createdAt, category, imageUrl } = post;
  const hasMoreThanThreeLines = excerpt.split('\n').length > 3;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/post/${id}`} className="block">
        {imageUrl && (
          <div className="relative h-48 w-full">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">{formatDate(createdAt)}</span>
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
              {category}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-2 line-clamp-2">{title}</h2>
          <div className="text-gray-600 mb-4 relative">
            <div className="line-clamp-3 prose prose-sm max-w-none prose-gray">
              <MDEditor.Markdown 
                source={excerpt.replace(/\n/g, '<br>')} 
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#4B5563'
                }}
              />
            </div>
            {hasMoreThanThreeLines && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">작성자: {author}</span>
          </div>
        </div>
      </Link>
    </article>
  );
});

BlogPost.displayName = 'BlogPost';

export default BlogPost; 