
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    coverImage: string;
    date: string;
    author: {
      name: string;
      avatar: string;
    };
    slug: string;
  };
  className?: string;
  index?: number;
}

const PostCard = ({ post, className, index = 0 }: PostCardProps) => {
  return (
    <article 
      className={cn(
        "group flex flex-col bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition duration-300 h-full",
        className
      )}
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: "slide-in 0.6s ease-out both" 
      }}
    >
      <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden aspect-[16/9]">
        <img
          src={post.coverImage}
          alt={post.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      
      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center mb-3">
          <span className="ml-auto flex items-center text-xs text-muted-foreground">
            <Clock size={12} className="mr-1" />
            {post.date}
          </span>
        </div>
        
        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-display font-medium mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground line-clamp-3 mb-4 flex-grow">
          {post.excerpt}
        </p>
        
        <div className="flex items-center mt-auto pt-4 border-t border-border">
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            className="w-8 h-8 rounded-full mr-3"
          />
          <span className="text-sm font-medium">
            {post.author.name}
          </span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
