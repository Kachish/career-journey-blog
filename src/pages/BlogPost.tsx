
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

import Layout from "@/components/Layout";
import SocialShare from "@/components/SocialShare";
import PostCard from "@/components/PostCard";
import PostInteractions from "@/components/PostInteractions";
import Comments from "@/components/Comments";
import { getPostBySlug, getRecentPosts } from "@/data/posts";
import { syncPostToSupabase } from "@/services/postService";
import { toast } from "sonner";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug || "");
  const relatedPosts = getRecentPosts(3, slug);
  const [isSyncing, setIsSyncing] = useState(true);

  // Sync post to Supabase and scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (post) {
      // Sync the post to Supabase
      const syncPost = async () => {
        try {
          await syncPostToSupabase(post);
        } catch (error) {
          console.error("Error syncing post to Supabase:", error);
        } finally {
          setIsSyncing(false);
        }
      };
      
      syncPost();
    } else {
      setIsSyncing(false);
    }
  }, [slug, post]);

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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-20">
        <div className="absolute inset-0 h-[70vh] bg-gradient-to-b from-black/60 to-black/0 z-10"></div>
        <div className="relative h-[70vh]">
          <img
            src={post.coverImage}
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
              <span className="mx-2 text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground">{post.category}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between mb-8 text-sm">
              <div className="flex items-center">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <span className="font-medium block">{post.author.name}</span>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
              
              <SocialShare 
                url={window.location.href} 
                title={post.title} 
              />
            </div>
            
            {/* Add Post Interactions */}
            {!isSyncing && <PostInteractions postId={post.id} />}
            
            <div className="prose prose-lg max-w-none mt-8">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
            
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <span className="font-medium block">Written by {post.author.name}</span>
                    <p className="text-sm text-muted-foreground">
                      Professional writer and career advisor with 10+ years of experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Comments Section */}
            {!isSyncing && <Comments postId={post.id} />}
          </div>
        </div>
      </section>
      
      {/* Related Posts Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-medium mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {relatedPosts.map((relatedPost, index) => (
              <PostCard key={relatedPost.id} post={relatedPost} index={index} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
