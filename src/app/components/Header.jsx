import { Link } from "react-router-dom";
import { useAuth, useUser } from "@/utils/clerkAuth";
import { SignOutButton, SignInButton } from "@clerk/clerk-react";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { isLoaded, user } = useUser();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <img
              src="/src/__create/favicon.png"
              alt="Veltrain Logo"
              className="h-8 w-8"
            />
            <Link to="/" className="text-xl font-bold text-amber-700">
              Veltrain
            </Link>
          </div>

          {isAuthenticated && isLoaded ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-amber-800">
                Hello, {user?.firstName || user?.email || "User"}!
              </span>
              <SignOutButton>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-900 bg-amber-200 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                  Logout
                </button>
              </SignOutButton>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <SignInButton mode="modal">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-900 bg-amber-200 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                  Login
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
