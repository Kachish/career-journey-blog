
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import Layout from "@/components/Layout";
import SocialShare from "@/components/SocialShare";
import PostCard from "@/components/PostCard";
import PostInteractions from "@/components/PostInteractions";
import Comments from "@/components/Comments";
import { getPostById, getAllPosts } from "@/services/postService";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadPost = async () => {
      setIsLoading(true);
      try {
        // Get all posts from database
        const posts = await getAllPosts();
        
        // Find the post with matching slug
        const currentPost = posts.find(p => p.slug === slug);
        
        if (currentPost) {
          setPost(currentPost);
          
          // Get related posts (excluding current post)
          // Only show posts older than 24 hours as related posts
          const now = new Date();
          const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          
          const related = posts
            .filter(p => {
              const postDate = new Date(p.date);
              return p.id !== currentPost.id && postDate < twentyFourHoursAgo;
            })
            .slice(0, 3);
            
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error("Error loading post:", error);
        toast.error("Failed to load blog post");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      loadPost();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-32 text-center">
          <p>Loading blog post...</p>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto py-32 text-center">
          <h1 className="text-3xl font-display font-medium mb-4">Post Not Found</h1>
          <p className="mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Format the date
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-20">
        <div className="absolute inset-0 h-[70vh] bg-gradient-to-b from-black/60 to-black/0 z-10"></div>
        <div className="relative h-[70vh]">
          <img
            src={post.cover_image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto relative z-20 mt-[-300px] px-4">
          <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Link
                to="/blog"
                className="text-sm font-medium text-primary hover:underline flex items-center"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Blog
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between mb-8 text-sm">
              <div className="flex items-center">
                <img
                  src="/omar.jpg"
                  alt="Omar"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <span className="font-medium block">Omar</span>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>
              
              <SocialShare 
                url={window.location.href} 
                title={post.title} 
              />
            </div>
            
            {/* Post Interactions */}
            <PostInteractions postId={post.id} />
            
            <div className="prose prose-lg max-w-none mt-8">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
            
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src="/omar.jpg"
                    alt="Omar"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <span className="font-medium block">Written by Omar</span>
                    <p className="text-sm text-muted-foreground">
                      Professional writer and career advisor with 10+ years of experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <Comments postId={post.id} />
          </div>
        </div>
      </section>
      
      {/* Related Posts Section - Only shown if there are posts older than 24 hours */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <PostCard 
                  key={relatedPost.id}
                  post={{
                    id: relatedPost.id,
                    title: relatedPost.title,
                    excerpt: relatedPost.excerpt,
                    coverImage: relatedPost.cover_image,
                    date: new Date(relatedPost.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric'
                    }),
                    author: {
                      name: "Omar",
                      avatar: "/omar.jpg"
                    },
                    slug: relatedPost.slug
                  }}
                  index={index} 
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BlogPost;
