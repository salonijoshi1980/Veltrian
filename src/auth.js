import { ClerkProvider, useAuth as useClerkAuth } from "@clerk/clerk-react";

// Make sure to add your publishable key to your .env.local file
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.CLERK_PUBLISHABLE_KEY;

// Only throw error in client context, in SSR we'll handle it gracefully
if (typeof window !== 'undefined' && !publishableKey) {
  throw new Error("Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file");
}

export { ClerkProvider, useClerkAuth };