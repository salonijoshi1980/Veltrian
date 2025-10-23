"use client";

import { useNavigate } from "react-router";
import { useAuth } from "@/utils/clerkAuth";

export default function TestAuthPage() {
  const { isLoaded, isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();

  if (!isLoaded) {
    return <div>Loading authentication...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Auth Test</h1>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded">
            <p className="font-medium">Authentication Status:</p>
            <p className={isAuthenticated ? "text-green-600" : "text-red-600"}>
              {isAuthenticated ? "Authenticated" : "Not Authenticated"}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <p className="font-medium">User ID:</p>
            <p className="break-all">{userId || "No user ID"}</p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate("/login")}
              className="block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
