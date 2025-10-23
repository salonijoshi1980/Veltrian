import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react';

/**
 * Custom hook to get authentication state from Clerk
 * @returns {Object} - Authentication state
 */
export function useAuth() {
  const { isLoaded, userId, sessionId, getToken } = useClerkAuth();
  
  return {
    isLoaded,
    userId,
    sessionId,
    isAuthenticated: !!userId,
    getToken
  };
}

/**
 * Custom hook to get user information from Clerk
 * @returns {Object} - User information
 */
export function useUser() {
  const { isLoaded, isSignedIn, user } = useClerkUser();
  
  return {
    isLoaded,
    isSignedIn,
    user: user ? {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl
    } : null
  };
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export function isLoggedIn() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Get current session token
 * @returns {Promise<string|null>}
 */
export async function getSessionToken() {
  const { getToken } = useAuth();
  if (getToken) {
    return await getToken();
  }
  return null;
}