import { Link } from "react-router-dom";
import { useAuth, useUser } from "@/utils/clerkAuth";
import { SignOutButton } from "@clerk/clerk-react";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { isLoaded, user } = useUser();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <img
                src="/Dragon logo1.png"
                alt="Veltrian Logo"
                className="w-8 h-7 object-contain -mr-3"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent pt-0.5">
                eltrian
              </span>
            </div>
          </div>

          {isAuthenticated && isLoaded ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-800">
                Hello, {user?.firstName || user?.email || "User"}!
              </span>
              <SignOutButton>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  Logout
                </button>
              </SignOutButton>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/app">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  Start exploring
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}