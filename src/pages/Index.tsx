
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import FeaturedPost from "@/components/FeaturedPost";
import PostCard from "@/components/PostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { posts, getAllCategories } from "@/data/posts";
import { getAllPosts } from "@/services/postService";

const Index = () => {
  const [featuredPost, setFeaturedPost] = useState<any>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const categories = getAllCategories();
  
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await getAllPosts();
        if (fetchedPosts && fetchedPosts.length > 0) {
          // Sort by date descending (newest first)
          const sortedPosts = [...fetchedPosts].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          // Set the newest post as featured
          setFeaturedPost(sortedPosts[0]);
          
          // Set recent posts (excluding the featured one)
          setRecentPosts(sortedPosts.slice(1, 4));
        } else {
          // Fallback to static data if no posts in database
          setFeaturedPost(posts[0]);
          setRecentPosts(posts.slice(1, 4));
        }
      } catch (error) {
        console.error("Error loading posts:", error);
        // Fallback to static data
        setFeaturedPost(posts[0]);
        setRecentPosts(posts.slice(1, 4));
      }
    };
    
    loadPosts();
  }, []);

  if (!featuredPost) {
    return <div className="container py-12">Loading...</div>;
  }

  return (
    <Layout>
      {/* Hero Section with Office/Computer Background */}
      <div 
        className="relative bg-cover bg-center py-20 md:py-32" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=4076&q=80')", 
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-white mb-6">
              Professional Insights for Your Career Growth
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8">
              Discover actionable strategies, expert advice, and the latest trends to advance your professional journey.
            </p>
            <Button asChild size="lg">
              <Link to="/blog">
                Explore All Articles <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Explore Topics Section (Moved to Top) */}
      <section className="container py-16">
        <h2 className="text-3xl font-display font-medium mb-8">Explore Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-medium mb-2">{category}</h3>
                <Button variant="link" asChild>
                  <Link to={`/blog?category=${encodeURIComponent(category)}`}>
                    View Articles <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Post Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="text-3xl font-display font-medium mb-8">Featured Article</h2>
          <FeaturedPost post={featuredPost} />
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-display font-medium">Recent Articles</h2>
          <Button asChild variant="outline">
            <Link to="/blog">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter Section (Moved to Bottom) */}
      <section className="bg-accent py-16">
        <div className="container">
          <h2 className="text-3xl font-display font-medium mb-8 text-center">
            Stay Updated
          </h2>
          <div className="max-w-lg mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
