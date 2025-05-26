import { Link } from 'react-router-dom';
import type { Post } from '../types/post';

interface BlogPostProps extends Post {}

const BlogPost = ({
  id,
  title,
  date,
  excerpt,
  author,
  imageUrl,
  category
}: BlogPostProps) => {
  return (
    <article className="bg-white shadow-sm rounded-lg overflow-hidden mb-8 hover:shadow-md transition-shadow">
      <Link to={`/post/${id}`} className="block">
        {imageUrl && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              {category}
            </span>
            <span className="mx-2">•</span>
            <time>{new Date(date).toLocaleString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</time>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600">
            {title}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
            {excerpt}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">{author}</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogPost; 