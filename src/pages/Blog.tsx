
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Search, Settings, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import FeaturedPost from "@/components/FeaturedPost";
import { getAllPosts } from "@/services/postService";

const Blog = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState<any>(null);

  // Load posts from Supabase
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(fetchedPosts.map(post => post.category))
        );
        setCategories(uniqueCategories);
        
        // Set the first post as featured if available
        if (fetchedPosts.length > 0) {
          setFeaturedPost(fetchedPosts[0]);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPosts();
  }, []);

  // Filter posts when category or search term changes
  useEffect(() => {
    let result = [...posts];
    
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
  }, [searchTerm, categoryParam, posts]);

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

          <div className="flex justify-end mb-8 gap-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/blog/manage">
                <Settings className="mr-2 h-4 w-4" />
                Manage Blog
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/blog/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-32">Loading posts...</div>
          ) : featuredPost ? (
            <FeaturedPost post={{
              id: featuredPost.id,
              title: featuredPost.title,
              excerpt: featuredPost.excerpt,
              coverImage: featuredPost.cover_image,
              date: new Date(featuredPost.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              author: {
                name: featuredPost.author_name,
                avatar: featuredPost.author_avatar
              },
              category: featuredPost.category,
              slug: featuredPost.slug
            }} />
          ) : (
            <div className="bg-muted/30 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-display font-medium mb-4">No blog posts yet</h2>
              <p className="text-muted-foreground mb-6">
                Start creating blog posts by clicking the "New Post" button above.
              </p>
              <Button asChild>
                <Link to="/blog/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create First Post
                </Link>
              </Button>
            </div>
          )}
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

          {posts.length > 0 ? (
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

              {categories.length > 0 && (
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
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              {!isLoading && (
                <p className="text-muted-foreground">
                  No blog posts available. Create your first post to get started.
                </p>
              )}
            </div>
          )}

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post, index) => (
                <PostCard 
                  key={post.id} 
                  post={{
                    id: post.id,
                    title: post.title,
                    excerpt: post.excerpt,
                    coverImage: post.cover_image,
                    date: new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    }),
                    author: {
                      name: post.author_name,
                      avatar: post.author_avatar
                    },
                    category: post.category,
                    slug: post.slug
                  }} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              {!isLoading && posts.length > 0 && (
                <>
                  <h3 className="text-xl mb-4">No articles found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/blog">View All Articles</Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
