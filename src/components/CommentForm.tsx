
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { addComment } from "@/services/postService";

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !message.trim()) {
      toast.error("Please enter both your name and a comment.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await addComment(postId, name, message);
      if (result) {
        toast.success("Comment added successfully!");
        setName("");
        setMessage("");
        onCommentAdded();
      } else {
        toast.error("Failed to add comment. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("An error occurred while submitting your comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="Your Comment"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full min-h-[100px]"
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Post Comment"}
      </Button>
    </form>
  );
};

export default CommentForm;
