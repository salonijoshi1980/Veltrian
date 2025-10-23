"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
      navigate("/app");
    }
  }, [isAuthenticated, navigate]);

  if (!isClient) return null;

  // If user is already authenticated, redirect them
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Veltrain</h1>
          <p className="text-gray-600">Cloudless File Manager</p>
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
            redirectUrl="/app"
          />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>🔒 Privacy-First File Manager</p>
          <p className="mt-2">All data stays local in your browser</p>
        </div>
      </div>
    </div>
  );
}
