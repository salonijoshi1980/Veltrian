import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/clerkAuth";

export default function HomePage() {
  const { isLoaded, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      if (isAuthenticated) {
        navigate("/app", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [isLoaded, isAuthenticated, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
