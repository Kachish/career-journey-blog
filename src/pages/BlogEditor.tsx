
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { createPost, updatePost, getPostById } from "@/services/postService";

const BlogEditor = () => {
  const { postId } = useParams<{ postId: string }>();
  const isEditMode = postId !== "new" && postId !== undefined;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    authorName: "Admin User",
    authorAvatar: "https://randomuser.me/api/portraits/men/1.jpg"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const loadPost = async () => {
        setIsLoading(true);
        try {
          const post = await getPostById(postId as string);
          if (post) {
            setFormData({
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              coverImage: post.cover_image,
              authorName: post.author_name,
              authorAvatar: post.author_avatar
            });
          } else {
            toast.error("Post not found");
            navigate("/blog/manage");
          }
        } catch (error) {
          console.error("Error loading post:", error);
          toast.error("Failed to load post details");
        } finally {
          setIsLoading(false);
        }
      };

      loadPost();
    }
  }, [postId, isEditMode, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Generate slug from title if the slug field is empty or being edited
    if (name === "title" && (!formData.slug || formData.slug === slugify(formData.title))) {
      setFormData({
        ...formData,
        [name]: value,
        slug: slugify(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/&/g, '-and-')      // Replace & with 'and'
      .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.content || !formData.coverImage) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (isEditMode) {
        const success = await updatePost(postId as string, {
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          coverImage: formData.coverImage,
          author: {
            name: formData.authorName,
            avatar: formData.authorAvatar
          }
        });
        
        if (success) {
          toast.success("Blog post updated successfully");
          navigate(`/blog/${formData.slug}`);
        } else {
          toast.error("Failed to update blog post");
        }
      } else {
        const newPostId = await createPost({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          coverImage: formData.coverImage,
          author: {
            name: formData.authorName,
            avatar: formData.authorAvatar
          }
        });
        
        if (newPostId) {
          toast.success("Blog post created successfully");
          navigate(`/blog/${formData.slug}`);
        } else {
          toast.error("Failed to create blog post");
        }
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("An error occurred while saving the post");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 text-center">
          Loading post details...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <Link
            to="/blog/manage"
            className="text-sm font-medium text-primary hover:underline flex items-center mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Blog Management
          </Link>
          <h1 className="text-3xl font-display font-medium">
            {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="url-friendly-post-name"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    placeholder="Brief summary of the post"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={2}
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="coverImage">Cover Image URL *</Label>
                  <Input
                    id="coverImage"
                    name="coverImage"
                    placeholder="https://example.com/image.jpg"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Separator />

                <div className="grid gap-3">
                  <Label htmlFor="content">
                    Post Content * <span className="text-xs text-muted-foreground">(Supports Markdown)</span>
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Write your blog post content here..."
                    value={formData.content}
                    onChange={handleInputChange}
                    className="min-h-[300px]"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/blog/manage")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BlogEditor;
