import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/clerkAuth";
import { deriveKey } from "@/utils/crypto";

export default function TestPage() {
  const { isLoaded, isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [testResult, setTestResult] = useState("");
  const navigate = useNavigate();
  // Removed unused encryptionKey state.

  useEffect(() => {
    setIsClient(true);

    // Redirect unauthenticated users to login
    if (isLoaded && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isLoaded, isAuthenticated, navigate]);

  // Test encryption key persistence
  useEffect(() => {
    if (isAuthenticated && isLoaded) {
      const runTest = async () => {
        try {
          // Check if encryption key is already set in session storage
          const keySet = sessionStorage.getItem("encryptionKeySet");
          if (keySet) {
            setTestResult(
              "Key marker present. Prompt user for passphrase to derive key (do not load from storage)."
            );
            // e.g., open a modal to collect passphrase and call deriveKey(pass)
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
            {/* Do not render passphrases or keys. */}
          </div>

          <button
            onClick={() => {
              sessionStorage.removeItem("encryptionKeySet");
              // Do not ever persist passphrases; nothing to remove.
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
