
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import FeaturedPost from "@/components/FeaturedPost";
import { posts, getAllCategories } from "@/data/posts";

const Blog = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const categories = getAllCategories();
  
  // Select the first post as the featured post
  const featuredPost = posts[0];

  useEffect(() => {
    let result = posts;
    
    if (categoryParam) {
      result = result.filter(
        (post) => post.category.toLowerCase() === categoryParam.toLowerCase()
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (post) => 
          post.title.toLowerCase().includes(term) || 
          post.excerpt.toLowerCase().includes(term) ||
          post.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredPosts(result);
  }, [searchTerm, categoryParam]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <section className="relative pt-20 md:pt-24 lg:pt-28">
        <div className="absolute inset-0 h-[50vh] bg-gradient-to-b from-background via-muted/50 to-background"></div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h1 className="mb-4 font-display text-4xl font-medium md:text-5xl lg:text-6xl">The Freelance Blog</h1>
            <p className="text-xl text-muted-foreground">Insights, tips, and resources for today's freelancers and career-minded professionals.</p>
          </div>

          <div className="flex justify-end mb-8">
            <Button asChild variant="outline" size="sm">
              <Link to="/blog/manage">
                <Settings className="mr-2 h-4 w-4" />
                Manage Blog
              </Link>
            </Button>
          </div>

          <FeaturedPost post={featuredPost} />
        </div>
      </section>

      <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-medium mb-4">
              {categoryParam ? categoryParam : "Blog"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Insights and strategies to help you excel in your professional journey, whether you're building a career, freelancing, or developing your personal brand.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-10">
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={!categoryParam ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                asChild
              >
                <Link to="/blog">All Posts</Link>
              </Button>
              
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    categoryParam === category ? "default" : "outline"
                  }
                  size="sm"
                  className="rounded-full"
                  asChild
                >
                  <Link to={`/blog?category=${encodeURIComponent(category)}`}>
                    {category}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl mb-4">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button asChild variant="outline">
                <Link to="/blog">View All Articles</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
