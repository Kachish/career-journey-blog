
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import Layout from "@/components/Layout";
import FeaturedPost from "@/components/FeaturedPost";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getAllCategories } from "@/data/posts";
import { getAllPosts } from "@/services/postService";

const Index = () => {
  const [featuredPost, setFeaturedPost] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Get all posts from the database
        const posts = await getAllPosts();
        
        if (posts && posts.length > 0) {
          // Sort posts by date (newest first) and use the first one as featured
          const sortedPosts = [...posts].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          // Format the featured post for the FeaturedPost component
          const formattedFeaturedPost = {
            id: sortedPosts[0].id,
            title: sortedPosts[0].title,
            excerpt: sortedPosts[0].excerpt,
            coverImage: sortedPosts[0].cover_image,
            date: new Date(sortedPosts[0].date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            author: {
              name: sortedPosts[0].author_name,
              avatar: sortedPosts[0].author_avatar || "/omar.jpg"
            },
            category: sortedPosts[0].category,
            slug: sortedPosts[0].slug
          };
          
          setFeaturedPost(formattedFeaturedPost);
          
          // Extract all categories from posts
          const allCategories = posts.map(post => post.category).filter(Boolean);
          const uniqueCategories = [...new Set(allCategories)];
          setCategories(uniqueCategories);
        } else {
          // Fallback to local data if no posts
          setCategories(getAllCategories());
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // Fallback to local data
        setCategories(getAllCategories());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-4">
        <div className="container mx-auto text-center">
          <span className="inline-block px-4 py-1 mb-4 text-sm font-medium rounded-full bg-secondary text-primary">
            Professional Development & Career Growth
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium max-w-4xl mx-auto leading-tight mb-6">
            Insights to Elevate Your Career Journey
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Expert guidance on career growth, freelancing success, and building your personal brand in today's dynamic professional landscape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/blog">
                Explore Articles
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-medium mb-8">Featured Article</h2>
          {isLoading ? (
            <div className="rounded-xl bg-gray-100 aspect-[2/1] animate-pulse flex items-center justify-center">
              <p className="text-muted-foreground">Loading featured post...</p>
            </div>
          ) : featuredPost ? (
            <FeaturedPost post={featuredPost} priority={true} />
          ) : (
            <div className="rounded-xl bg-gray-100 aspect-[2/1] flex items-center justify-center">
              <p className="text-muted-foreground">No featured posts available</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-medium mb-8 text-center">
            Explore Topics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {categories.map((category, index) => (
              <Link
                key={category}
                to={`/blog?category=${encodeURIComponent(category)}`}
                className="block p-6 bg-white border border-border rounded-lg hover:shadow-md transition-shadow text-center group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-display font-medium group-hover:text-primary transition-colors">
                  {category}
                </h3>
                <p className="text-muted-foreground mt-2">
                  Explore Articles
                </p>
              </Link>
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

      {/* About Section */}
      <section className="py-12 md:py-16 px-4 bg-primary/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-medium mb-4">
                About CareerCanvas
              </h2>
              <p className="text-muted-foreground mb-6">
                We're dedicated to providing professionals with actionable insights, strategies, and inspiration to advance their careers, build successful freelance businesses, and develop authentic personal brands.
              </p>
              <p className="text-muted-foreground mb-6">
                Whether you're climbing the corporate ladder, venturing into freelancing, or establishing yourself as an industry thought leader, our content is designed to help you navigate your professional journey with confidence.
              </p>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-2xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
                alt="Professional working" 
                className="rounded-2xl relative z-10 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
