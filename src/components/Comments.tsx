
import { useEffect, useState } from "react";
import { getPostComments, PostComment } from "@/services/postService";
import { formatDistanceToNow } from "date-fns";
import CommentForm from "./CommentForm";
import { Separator } from "@/components/ui/separator";

interface CommentsProps {
  postId: string;
}

const Comments = ({ postId }: CommentsProps) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadComments = async () => {
    try {
      const fetchedComments = await getPostComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-display font-medium mb-6">Comments</h3>
      
      <CommentForm postId={postId} onCommentAdded={loadComments} />
      
      <Separator className="my-8" />
      
      {isLoading ? (
        <div className="text-center py-8">Loading comments...</div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-secondary/20 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{comment.name}</h4>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-muted-foreground">{comment.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No comments yet. Be the first to share your thoughts!
        </div>
      )}
    </div>
  );
};

export default Comments;
