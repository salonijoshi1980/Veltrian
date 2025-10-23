import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useAuth as useClerkCustomAuth } from "./clerkAuth";

// Re-export the clerkAuth version to maintain consistency
// and avoid having two different "useAuth" shapes in the codebase
function useAuth() {
  return useClerkCustomAuth();
}

export default useAuth;
