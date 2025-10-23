import { useEffect } from "react";
import { useAuth } from "@/utils/clerkAuth";

export default function HomePage() {
  const { isLoaded, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isAuthenticated) {
        window.location.href = "/app";
      } else {
        window.location.href = "/login";
      }
    }
  }, [isLoaded, isAuthenticated]);

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
