import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";
import { useAuth } from "@/utils/clerkAuth";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsClient(true);

    // Redirect authenticated users to the app
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isClient) return null;

  // If user is already authenticated, redirect them
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full border border-slate-200">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center">
            <img
              src="/Dragon logo1.png"
              alt="Veltrian Logo"
              className="w-12 h-12 object-contain -mr-2"
            />
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent pt-0.5">
              eltrian
            </span>
          </div>
          <p className="text-slate-600 mt-2">Cloudless File Manager</p>
        </div>

        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                card: "shadow-none border-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
              },
            }}
            redirectUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL || "/app"}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
          <p>🔒 Privacy-First File Manager</p>
          <p className="mt-2">All data stays local in your browser</p>
        </div>
      </div>
    </div>
  );
}
