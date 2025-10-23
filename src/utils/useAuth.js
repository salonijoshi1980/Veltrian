import { useCallback } from "react";
import {
  useAuth as useClerkAuth,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-react";

function useAuth() {
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { userId, sessionId, getToken, isLoaded: authLoaded } = useClerkAuth();

  const signInWithCredentials = useCallback(
    async (options) => {
      if (!signInLoaded) return;

      try {
        const result = await signIn.create({
          identifier: options.email,
          password: options.password,
        });

        return result;
      } catch (error) {
        console.error("Sign in error:", error);
        throw error;
      }
    },
    [signIn, signInLoaded]
  );

  const signUpWithCredentials = useCallback(
    async (options) => {
      if (!signUpLoaded) return;

      try {
        const result = await signUp.create({
          emailAddress: options.email,
          password: options.password,
        });

        return result;
      } catch (error) {
        console.error("Sign up error:", error);
        throw error;
      }
    },
    [signUp, signUpLoaded]
  );

  const signOut = useCallback(async () => {
    // Clerk handles sign out through their components
    // We just need to redirect after sign out if needed
    window.location.href = "/login";
  }, []);

  return {
    signInWithCredentials,
    signUpWithCredentials,
    signOut,
    userId,
    sessionId,
    getToken,
    isAuthenticated: !!userId,
    isLoaded: authLoaded && signInLoaded && signUpLoaded,
  };
}

export default useAuth;
