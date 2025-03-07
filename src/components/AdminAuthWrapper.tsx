
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

const AdminAuthWrapper = ({ children }: AdminAuthWrapperProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          navigate("/admin");
          return;
        }
        
        const { data: isAdminData, error } = await supabase.rpc('is_blog_admin');
        
        if (error) {
          throw error;
        }
        
        if (!isAdminData) {
          toast.error("You do not have admin privileges");
          navigate("/admin");
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error("Admin authentication error:", error);
        navigate("/admin");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Verifying admin credentials...</p>
      </div>
    );
  }

  return isAdmin ? <>{children}</> : null;
};

export default AdminAuthWrapper;
