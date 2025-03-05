
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { posts, getAllCategories } from "@/data/posts";

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayedPosts, setDisplayedPosts] = useState(posts);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const categories = getAllCategories();
  
  // Handle initial URL parameters
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setActiveCategory(categoryParam);
      filterPostsByCategory(categoryParam);
    }
  }, [searchParams]);
  
  const filterPostsByCategory = (category: string | null) => {
    if (category) {
      setDisplayedPosts(posts.filter(post => post.category === category));
    } else {
      setDisplayedPosts(posts);
    }
  };
  
  const handleCategoryClick = (category: string) => {
    if (activeCategory === category) {
      // Deselect current category
      setActiveCategory(null);
      setSearchParams({});
      filterPostsByCategory(null);
    } else {
      // Select new category
      setActiveCategory(category);
      setSearchParams({ category });
      filterPostsByCategory(category);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
      );
      setDisplayedPosts(filtered);
      setActiveCategory(null);
    } else {
      setDisplayedPosts(posts);
      setActiveCategory(null);
    }
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory(null);
    setDisplayedPosts(posts);
    setSearchParams({});
  };

  return (
    <Layout>
      {/* Blog Header */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-display font-medium mb-6">
            The Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover articles, guides, and insights to help you navigate your professional journey, develop your skills, and build your career.
          </p>
        </div>
      </section>
      
      {/* Filter and Search */}
      <section className="py-6 px-4 border-b border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category}
                </button>
              ))}
              {(activeCategory || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
            
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto max-w-md">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Blog Posts Grid */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          {displayedPosts.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-display font-medium">
                  {activeCategory 
                    ? `Articles in ${activeCategory}` 
                    : searchQuery 
                      ? `Search Results for "${searchQuery}"` 
                      : "All Articles"}
                </h2>
                <p className="text-muted-foreground">
                  Showing {displayedPosts.length} {displayedPosts.length === 1 ? "article" : "articles"}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {displayedPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-display font-medium mb-4">No Articles Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any articles matching your search criteria.
              </p>
              <Button onClick={clearFilters}>View All Articles</Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-12 md:py-16 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <NewsletterSignup />
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
