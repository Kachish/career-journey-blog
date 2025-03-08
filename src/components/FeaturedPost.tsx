
import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturedPostProps {
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
    category: string;
    slug: string;
  };
  priority?: boolean;
}

const FeaturedPost = ({ post, priority = false }: FeaturedPostProps) => {
  return (
    <div className="group relative animate-fade-in">
      <Link 
        to={`/blog/${post.slug}`} 
        className="block relative overflow-hidden rounded-xl aspect-[16/9] md:aspect-[2/1] glow-image"
      >
        <img
          src={post.coverImage}
          alt={post.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/5 group-hover:from-black/70 transition-colors duration-300"></div>
      </Link>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center space-x-2 mb-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
            {post.category}
          </span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-display font-medium mb-2 group-hover:underline decoration-1 underline-offset-2">
          {post.title}
        </h2>
        
        <p className="text-white/90 line-clamp-2 md:line-clamp-none mb-4 max-w-3xl">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-white/75 text-sm">
          <div className="flex items-center gap-2">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{post.author.name}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{post.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
