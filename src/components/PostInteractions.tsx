
import { useState, useEffect } from "react";
import { ThumbsUp, Heart, Award, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addInteraction, getPostInteractions } from "@/services/postService";

interface InteractionType {
  type: 'like' | 'love' | 'insightful' | 'celebrate';
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface PostInteractionsProps {
  postId: string;
}

const InteractionTypes: InteractionType[] = [
  { 
    type: 'like', 
    icon: <ThumbsUp className="h-4 w-4" />, 
    label: 'Like',
    color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
  },
  { 
    type: 'love', 
    icon: <Heart className="h-4 w-4" />, 
    label: 'Love',
    color: 'bg-red-100 text-red-600 hover:bg-red-200'
  },
  { 
    type: 'insightful', 
    icon: <Award className="h-4 w-4" />, 
    label: 'Insightful',
    color: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
  },
  { 
    type: 'celebrate', 
    icon: <PartyPopper className="h-4 w-4" />, 
    label: 'Celebrate',
    color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
  }
];

const PostInteractions = ({ postId }: PostInteractionsProps) => {
  const [interactions, setInteractions] = useState<{ [key: string]: number }>({
    like: 0,
    love: 0,
    insightful: 0,
    celebrate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInteractions = async () => {
      try {
        const counts = await getPostInteractions(postId);
        setInteractions(counts);
      } catch (error) {
        console.error("Error loading interactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInteractions();
  }, [postId]);

  const handleInteraction = async (type: 'like' | 'love' | 'insightful' | 'celebrate') => {
    try {
      // Optimistically update the UI
      setInteractions(prev => ({
        ...prev,
        [type]: prev[type] + 1
      }));
      
      const success = await addInteraction(postId, type);
      
      if (!success) {
        // Revert the optimistic update
        setInteractions(prev => ({
          ...prev,
          [type]: prev[type] - 1
        }));
        toast.error(`Failed to add ${type}. Please try again.`);
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="flex gap-2 mt-6">Loading interactions...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {InteractionTypes.map((interaction) => (
        <Button
          key={interaction.type}
          variant="outline"
          size="sm"
          onClick={() => handleInteraction(interaction.type)}
          className={`${interaction.color} border-none`}
        >
          {interaction.icon}
          <span className="ml-1">{interactions[interaction.type]}</span>
        </Button>
      ))}
    </div>
  );
};

export default PostInteractions;
