
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Edit, Trash2, ArrowLeft, LogOut } from "lucide-react";
import Layout from "@/components/Layout";
import AdminAuthWrapper from "@/components/AdminAuthWrapper";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { getAllPosts, deletePost } from "@/services/postService";
import { supabase } from "@/integrations/supabase/client";

const BlogManagement = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
        toast.error("Failed to load blog posts");
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    
    try {
      toast.info("Deleting post...");
      
      // First delete all comments and interactions for this post
      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .eq('post_id', postToDelete);
        
      if (commentsError) {
        console.error("Error deleting comments:", commentsError);
      }
      
      const { error: interactionsError } = await supabase
        .from('post_interactions')
        .delete()
        .eq('post_id', postToDelete);
        
      if (interactionsError) {
        console.error("Error deleting interactions:", interactionsError);
      }
      
      // Then delete the post
      const success = await deletePost(postToDelete);
      if (success) {
        setPosts(posts.filter(post => post.id !== postToDelete));
        toast.success("Blog post deleted successfully");
      } else {
        toast.error("Failed to delete blog post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting the post");
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/blog");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AdminAuthWrapper>
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                to="/blog"
                className="text-sm font-medium text-primary hover:underline flex items-center mb-4"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Blog
              </Link>
              <h1 className="text-3xl font-display font-medium">Blog Management</h1>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
              <Button asChild>
                <Link to="/blog/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Post
                </Link>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading blog posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No blog posts found</p>
              <Button asChild>
                <Link to="/blog/new">Create Your First Post</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="hover:underline"
                        >
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>{formatDate(post.date)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/blog/edit/${post.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  blog post and all associated comments and interactions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Layout>
    </AdminAuthWrapper>
  );
};

export default BlogManagement;
