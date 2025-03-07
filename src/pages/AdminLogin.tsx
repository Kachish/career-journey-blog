
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("omaryw003@gmail.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter email");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First attempt with provided password if any
      const credentials = {
        email,
        password: password || "Calcium@123" // Use provided password or default
      };
      
      console.log("Attempting login with credentials:", { email: credentials.email, passwordProvided: !!password });
      
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      
      if (error) {
        console.error("Login attempt failed:", error.message);
        
        // If first attempt fails and user provided a password different from default, try with default
        if (password && password !== "Calcium@123") {
          console.log("Attempting login with default password");
          const fallbackResult = await supabase.auth.signInWithPassword({
            email,
            password: "Calcium@123"
          });
          
          if (fallbackResult.error) {
            throw fallbackResult.error;
          }
          
          data.user = fallbackResult.data.user;
        } else {
          throw error;
        }
      }
      
      if (data.user) {
        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .rpc('is_blog_admin');
        
        if (adminError) {
          throw adminError;
        }
        
        if (adminData) {
          toast.success("Login successful");
          navigate("/blog/manage");
        } else {
          // Sign out if not admin
          await supabase.auth.signOut();
          toast.error("You do not have admin privileges");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-16 flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">Admin Login</CardTitle>
            <CardDescription>
              Login to manage blog content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Lock size={14} />
              <span>Only authorized administrators can access this area</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminLogin;
