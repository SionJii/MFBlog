import { Link } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';

interface BlogPostProps {
  id: string;
  title: string;
  createdAt: Date;
  excerpt: string;
  author: string;
  imageUrl?: string;
  category: string;
}

const BlogPost = ({
  id,
  title,
  createdAt,
  excerpt,
  author,
  imageUrl,
  category
}: BlogPostProps) => {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden mb-8 hover:shadow-md transition-shadow">
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
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <span>{author}</span>
          <span className="text-gray-300">•</span>
          <time dateTime={createdAt.toISOString()}>
            {createdAt.toLocaleDateString()}
          </time>
          <span className="text-gray-300">•</span>
          <span>{category}</span>
        </div>
        <Link to={`/post/${id}`} className="block">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-600">
            {title}
          </h2>
        </Link>
        <div className="prose prose-sm max-w-none text-gray-600 relative">
          <div data-color-mode="light" className="line-clamp-3">
            <MDEditor.Markdown source={excerpt} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>
    </article>
  );
};

export default BlogPost; 