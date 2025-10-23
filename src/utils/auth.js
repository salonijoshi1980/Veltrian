// Auth utilities for Clerk integration
// Previous fake auth implementation has been removed

export {};
// Fake authentication utilities

const SESSION_KEY = "veltrain_session";

/**
 * Simulate login and store session
 * @param {string} username - Username
 * @param {string} password - Password (not validated)
 * @returns {boolean} - Always true for fake login
 */
export function fakeLogin(username, password) {
  if (!username || !password) return false;

  const session = {
    username,
    loginTime: Date.now(),
    isAuthenticated: true,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return true;
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export function isLoggedIn() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session).isAuthenticated : false;
}

/**
 * Get current session
 * @returns {Object|null}
 */
export function getSession() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

/**
 * Logout user
 * @returns {void}
 */
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
