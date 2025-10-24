// Legacy fake auth utilities (dev/test only). Clerk is the primary auth provider.
// TODO: Remove after full migration to Clerk authentication.

const SESSION_KEY = "veltrain_session";
const isBrowser =
  typeof window !== "undefined" && typeof localStorage !== "undefined";

/**
 * Simulate login and store session
 * @param {string} username - Username
 * @param {string} password - Password (not validated)
 * @returns {boolean} - Always true for fake login
 */
// Legacy fake auth utilities (dev/test only). Clerk is the primary auth provider.
// TODO: Remove after full migration to Clerk authentication.

export function fakeLogin(username, password) {
  if (!username || !password) return false;
  if (!isBrowser) return false;
  const session = {
    username,
    loginTime: Date.now(),
    isAuthenticated: true,
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
  return true;
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export function isLoggedIn() {
  if (!isBrowser) return false;
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session).isAuthenticated : false;
  } catch {
    return false;
  }
}

/**
 * Get current session
 * @returns {Object|null}
 */
export function getSession() {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Logout user
 * @returns {void}
 */
export function logout() {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}
