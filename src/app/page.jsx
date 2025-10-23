'use client';

import { useEffect, useState } from 'react';
import { isLoggedIn } from '../utils/auth';

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (!isLoggedIn()) {
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  // Redirect to main app
  if (typeof window !== 'undefined') {
    window.location.href = '/app';
  }

  return null;
}
