
import { Twitter, Linkedin, Facebook, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SocialShareProps {
  url: string;
  title: string;
  className?: string;
}

const SocialShare = ({ url, title, className }: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard");
    });
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      
      <a 
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter size={16} />
      </a>
      
      <a 
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={16} />
      </a>
      
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook size={16} />
      </a>
      
      <button
        onClick={handleCopyLink}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        aria-label="Copy link"
      >
        <Link size={16} />
      </button>
    </div>
  );
};

export default SocialShare;
