
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
        duration: 5000,
      });
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-primary/5 rounded-xl p-8 md:p-10">
      <div className="max-w-md mx-auto text-center">
        <h3 className="text-2xl font-display font-medium mb-2">Stay Updated</h3>
        <p className="text-muted-foreground mb-6">
          Get the latest articles, resources, and career insights delivered straight to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow"
            aria-label="Email address"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-4">
          By subscribing, you agree to our Privacy Policy. We respect your inbox and will never share your email.
        </p>
      </div>
    </div>
  );
};

export default NewsletterSignup;
