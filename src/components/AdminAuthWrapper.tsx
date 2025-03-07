
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        const isAuthenticated = localStorage.getItem("blogAdminAuthenticated") === "true";
        
        if (!isAuthenticated) {
          toast.error("Please login to access admin area");
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
