
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, User } from "lucide-react";
import Markdown from "react-markdown";

import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import SocialShare from "@/components/SocialShare";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getPostBySlug, getPostsByCategory, getRecentPosts } from "@/data/posts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (slug) {
      const foundPost = getPostBySlug(slug);
      
      if (foundPost) {
        setPost(foundPost);
        
        // Get related posts by category, fall back to recent posts if not enough
        let related = getPostsByCategory(foundPost.category, 3).filter(p => p.id !== foundPost.id);
        if (related.length < 3) {
          const additional = getRecentPosts(3 - related.length, foundPost.slug)
            .filter(p => p.category !== foundPost.category);
          related = [...related, ...additional];
        }
        
        setRelatedPosts(related.slice(0, 3));
      } else {
        navigate("/404");
      }
    }
  }, [slug, navigate]);
  
  if (!post) {
    return null; // Loading state
  }

  return (
    <Layout>
      {/* Post Header */}
      <article>
        <div className="pt-32 pb-8 md:pt-40 md:pb-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Articles
            </Link>
            
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary text-primary">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium leading-tight mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm md:text-base">{post.author.name}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span className="text-sm md:text-base">{post.date}</span>
              </div>
              
              <div className="ml-auto">
                <SocialShare url={window.location.href} title={post.title} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="mb-12">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="rounded-xl overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-auto object-cover"
                style={{ maxHeight: "600px" }}
              />
            </div>
          </div>
        </div>
        
        {/* Post Content */}
        <div className="container mx-auto max-w-3xl px-4 mb-16">
          <div className="prose prose-lg max-w-none blog-content">
            <Markdown>{post.content}</Markdown>
          </div>
          
          {/* Tags and Share */}
          <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Posted in:</h4>
              <Link 
                to={`/blog?category=${encodeURIComponent(post.category)}`}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary text-primary hover:bg-secondary/80 transition-colors"
              >
                {post.category}
              </Link>
            </div>
            
            <SocialShare url={window.location.href} title={post.title} />
          </div>
          
          {/* Author Box */}
          <div className="mt-12 p-6 bg-secondary/30 rounded-xl flex flex-col md:flex-row gap-6 items-center md:items-start">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h3 className="text-xl font-display font-medium mb-2">{post.author.name}</h3>
              <p className="text-muted-foreground mb-4">
                Professional writer and career development specialist with over a decade of experience helping professionals navigate their career journeys.
              </p>
              <div className="flex gap-2">
                <Link 
                  to={`/author/${post.author.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
      
      {/* Related Posts */}
      <section className="py-12 md:py-16 bg-secondary/30 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-medium mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {relatedPosts.map((relatedPost, index) => (
              <PostCard key={relatedPost.id} post={relatedPost} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <NewsletterSignup />
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
