"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/utils/clerkAuth";
import { deriveKey } from "@/utils/crypto";

export default function TestPage() {
  const { isLoaded, isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [encryptionKey, setEncryptionKey] = useState(null);

  useEffect(() => {
    setIsClient(true);

    // Redirect unauthenticated users to login
    if (isLoaded && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isLoaded, isAuthenticated]);

  // Test encryption key persistence
  useEffect(() => {
    if (isAuthenticated && isLoaded) {
      const runTest = async () => {
        try {
          // Check if encryption key is already set in session storage
          const keySet = sessionStorage.getItem("encryptionKeySet");
          const savedPassphrase = sessionStorage.getItem(
            "encryptionPassphrase"
          );

          if (keySet && savedPassphrase) {
            setTestResult(
              "Found encryption key in sessionStorage. Attempting to restore..."
            );

            // Try to restore the encryption key from the saved passphrase
            const key = await deriveKey(savedPassphrase);
            setEncryptionKey(key);
            setTestResult("SUCCESS: Encryption key restored successfully!");
          } else {
            setTestResult(
              "No encryption key found in sessionStorage. Need to set up encryption."
            );
          }
        } catch (error) {
          console.error("Test error:", error);
          setTestResult(`ERROR: ${error.message}`);
        }
      };

      runTest();
    }
  }, [isAuthenticated, isLoaded]);

  if (!isClient || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Encryption Key Test
          </h1>
          <p className="text-gray-600">Testing encryption key persistence</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Test Result:</p>
            <p className="mt-2 text-gray-900">{testResult}</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm font-medium text-gray-700">
              Session Storage Values:
            </p>
            <p className="mt-2 text-gray-900">
              encryptionKeySet:{" "}
              {sessionStorage.getItem("encryptionKeySet") || "null"}
            </p>
            <p className="mt-1 text-gray-900">
              encryptionPassphrase:{" "}
              {sessionStorage.getItem("encryptionPassphrase") || "null"}
            </p>
          </div>

          <button
            onClick={() => {
              sessionStorage.removeItem("encryptionKeySet");
              sessionStorage.removeItem("encryptionPassphrase");
              window.location.reload();
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition"
          >
            Clear Session Storage
          </button>
        </div>
      </div>
    </div>
  );
}
