"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth, useUser } from "@/utils/clerkAuth";
import { SignOutButton, SignInButton } from "@clerk/clerk-react";
import { useFileOperations } from "@/app/hooks/useFileOperations";
import { useFormatting } from "@/app/hooks/useFormatting";
import { deriveKey } from "@/utils/crypto";
import PassphraseSetupModal from "@/app/components/FileManager/PassphraseSetupModal";
import FileList from "@/app/components/FileManager/FileList";
import UploadArea from "@/app/components/FileManager/UploadArea";
import PreviewModal from "@/app/components/FileManager/PreviewModal";

export default function AppPage() {
  const { isLoaded, isAuthenticated } = useAuth();
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Guest access state
  const [showLoginSplash, setShowLoginSplash] = useState(false);
  const [guestAccessActive, setGuestAccessActive] = useState(true);

  // Encryption state
  const [passphrase, setPassphrase] = useState("");
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [showPassphraseSetup, setShowPassphraseSetup] = useState(false);

  // File management state
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Preview state
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fileInputRef = useRef(null);
  const backupInputRef = useRef(null);
  const guestTimerRef = useRef(null);

  // Custom hooks
  const guestFileOperations = useFileOperations(null);
  const authFileOperations = useFileOperations(encryptionKey);

  const { formatFileSize, formatDate } = useFormatting();

  // Guest access management
  const GUEST_ACCESS_KEY = 'veltrain_guest_access';
  const GUEST_FIRST_VISIT_KEY = 'veltrain_first_visit';

  // Initialize
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if this is user's first visit
  const isFirstVisit = () => {
    return !localStorage.getItem(GUEST_FIRST_VISIT_KEY);
  };

  // Mark first visit
  const markFirstVisit = () => {
    localStorage.setItem(GUEST_FIRST_VISIT_KEY, 'true');
  };

  // Get guest access data
  const getGuestAccessData = () => {
    try {
      const data = localStorage.getItem(GUEST_ACCESS_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  // Set guest access data
  const setGuestAccessData = (expiresAt, usageCount = 0) => {
    const data = {
      expiresAt,
      usageCount,
      createdAt: Date.now()
    };
    localStorage.setItem(GUEST_ACCESS_KEY, JSON.stringify(data));
  };

  // Clear guest access data
  const clearGuestAccessData = () => {
    localStorage.removeItem(GUEST_ACCESS_KEY);
  };

  // Check if guest access has expired
  const hasGuestAccessExpired = () => {
    const data = getGuestAccessData();
    if (!data) return false;
    
    const now = Date.now();
    return now > data.expiresAt;
  };

  // Get guest access usage count
  const getGuestAccessUsageCount = () => {
    const data = getGuestAccessData();
    return data ? data.usageCount : 0;
  };

  // Increment guest access usage
  const incrementGuestAccessUsage = () => {
    const data = getGuestAccessData();
    if (data) {
      data.usageCount = (data.usageCount || 0) + 1;
      localStorage.setItem(GUEST_ACCESS_KEY, JSON.stringify(data));
    }
  };

  // Start guest access timer when user accesses the app without login
  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      // Check if this is first visit
      if (isFirstVisit()) {
        // First visit - grant 2 minutes access
        const expiresAt = Date.now() + (2 * 60 * 1000);
        setGuestAccessData(expiresAt, 0);
        markFirstVisit();
        setGuestAccessActive(true);
        startGuestAccessTimer();
        loadGuestFiles();
      } else {
        // Not first visit - check existing access
        const guestData = getGuestAccessData();
        
        if (!guestData || hasGuestAccessExpired()) {
          // No valid guest access
          setShowLoginSplash(true);
          setGuestAccessActive(false);
          return;
        }

        // Check usage limits (optional: limit number of guest sessions)
        const usageCount = getGuestAccessUsageCount();
        if (usageCount >= 3) { // Limit to 3 guest sessions
          setShowLoginSplash(true);
          setGuestAccessActive(false);
          return;
        }

        // Valid guest access
        setGuestAccessActive(true);
        startGuestAccessTimer();
        loadGuestFiles();
        
        // Increment usage count
        incrementGuestAccessUsage();
      }
    } else {
      // Clear guest data when user logs in
      clearGuestAccessData();
      setGuestAccessActive(false);
      setShowLoginSplash(false);
    }

    return () => {
      if (guestTimerRef.current) {
        clearTimeout(guestTimerRef.current);
      }
    };
  }, [isLoaded, isAuthenticated]);

  // Guest access timer
  const startGuestAccessTimer = () => {
    if (guestTimerRef.current) {
      clearTimeout(guestTimerRef.current);
    }

    const guestData = getGuestAccessData();
    if (!guestData) return;

    const timeLeft = guestData.expiresAt - Date.now();
    
    if (timeLeft <= 0) {
      setShowLoginSplash(true);
      setGuestAccessActive(false);
      return;
    }

    guestTimerRef.current = setTimeout(() => {
      setShowLoginSplash(true);
      setGuestAccessActive(false);
      clearGuestAccessData(); // Clear the data since timer completed
    }, timeLeft);
  };

  // Reset guest timer on user interaction
  const resetGuestTimer = () => {
    if (!isAuthenticated && guestAccessActive) {
      // Don't reset the expiry time, just restart the timer
      startGuestAccessTimer();
    }
  };

  // Clear all guest data (nuclear option)
  const clearAllGuestData = () => {
    clearGuestAccessData();
    localStorage.removeItem(GUEST_FIRST_VISIT_KEY);
    // Also clear any guest files from IndexedDB
    if (typeof window !== 'undefined' && window.indexedDB) {
      // This would require your database cleanup logic
      console.log('Clearing guest data...');
    }
  };

  // Load guest files (without encryption)
  const loadGuestFiles = () => {
    if (!isAuthenticated) {
      guestFileOperations.loadFiles(setFiles, setError);
    }
  };

  // Check if we need to show encryption setup
  useEffect(() => {
    if (isAuthenticated && isLoaded) {
      setShowPassphraseSetup(true);
    } else {
      setEncryptionKey(null);
      setShowPassphraseSetup(false);
    }
  }, [isAuthenticated, isLoaded]);

  // Load files from IndexedDB when authentication or encryption changes
  useEffect(() => {
    if (isAuthenticated && isLoaded && encryptionKey) {
      authFileOperations.loadFiles(setFiles, setError);
    } else if (!isAuthenticated) {
      loadGuestFiles();
    }
  }, [isAuthenticated, isLoaded, encryptionKey]);

  // Setup encryption key from passphrase
  const handleSetupPassphrase = async (passphrase) => {
    setError("");
    setIsLoading(true);

    try {
      if (!passphrase.trim()) {
        setError("Please enter a passphrase");
        setIsLoading(false);
        return;
      }

      const key = await deriveKey(passphrase);
      setEncryptionKey(key);
      setShowPassphraseSetup(false);
      setSuccess("Encryption key set successfully!");

      sessionStorage.setItem("encryptionKeySet", "true");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error setting up passphrase:", err);
      setError("Failed to set up encryption");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    resetGuestTimer();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    resetGuestTimer();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUploadWrapper(files);
    }
  };

  const handleFileUploadWrapper = (files) => {
    // Check if guest access has expired
    if (!isAuthenticated && showLoginSplash) {
      setError("Please login to continue using the platform");
      return;
    }

    resetGuestTimer();

    const fileOps = isAuthenticated ? authFileOperations : guestFileOperations;
    
    if (isAuthenticated && !encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }

    fileOps.handleFileUpload(
      files,
      setIsUploading,
      setError,
      setSuccess,
      setUploadProgress,
      () => {
        if (isAuthenticated) {
          authFileOperations.loadFiles(setFiles, setError);
        } else {
          loadGuestFiles();
        }
      }
    );
  };

  // Handle backup operations
  const handleExportBackupWrapper = () => {
    if (!isAuthenticated && showLoginSplash) {
      setError("Please login to continue using the platform");
      return;
    }

    resetGuestTimer();

    const fileOps = isAuthenticated ? authFileOperations : guestFileOperations;
    
    if (isAuthenticated && !encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }

    fileOps.handleExportBackup(setIsLoading, setError, setSuccess);
  };

  const handleImportBackupWrapper = (e) => {
    if (!isAuthenticated && showLoginSplash) {
      setError("Please login to continue using the platform");
      return;
    }

    resetGuestTimer();

    const fileOps = isAuthenticated ? authFileOperations : guestFileOperations;
    
    if (isAuthenticated && !encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }

    fileOps.handleImportBackup(
      e,
      setSuccess,
      setError,
      setIsLoading,
      () => {
        if (isAuthenticated) {
          authFileOperations.loadFiles(setFiles, setError);
        } else {
          loadGuestFiles();
        }
      },
      backupInputRef
    );
  };

  // Handle file operations
  const handlePreviewWrapper = (file) => {
    if (!isAuthenticated && showLoginSplash) {
      setError("Please login to continue using the platform");
      return;
    }

    resetGuestTimer();

    const fileOps = isAuthenticated ? authFileOperations : guestFileOperations;
    
    if (isAuthenticated && !encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }

    fileOps.handlePreview(
      file,
      setPreviewFile,
      setPreviewUrl,
      setIsLoading,
      setError
    );
  };

  const handleExportWrapper = (file) => {
    if (!isAuthenticated && showLoginSplash) {
      setError("Please login to continue using the platform");
      return;
    }

    resetGuestTimer();

    const fileOps = isAuthenticated ? authFileOperations : guestFileOperations;
    
    if (isAuthenticated && !encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }

    fileOps.handleExportFile(file, setSuccess, setError, setIsLoading);
  };

  const handleDeleteWrapper = (fileId) => {
    if (!isAuthenticated && showLoginSplash) {
      setError("Please login to continue using the platform");
      return;
    }

    resetGuestTimer();

    const fileOps = isAuthenticated ? authFileOperations : guestFileOperations;
    
    if (isAuthenticated && !encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }

    fileOps.handleDelete(fileId, setSuccess, setError, () => {
      if (isAuthenticated) {
        authFileOperations.loadFiles(setFiles, setError);
      } else {
        loadGuestFiles();
      }
    });
  };

  // Close preview
  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewFile(null);
    setPreviewUrl("");
  };

  // Force clear guest data (for testing)
  const handleForceClearGuestData = () => {
    clearAllGuestData();
    setShowLoginSplash(false);
    setGuestAccessActive(true);
    // Give them one more chance
    const expiresAt = Date.now() + (2 * 60 * 1000);
    setGuestAccessData(expiresAt, 0);
    startGuestAccessTimer();
  };

  if (!isClient || !isLoaded) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Login Splash Screen */}
      {showLoginSplash && !isAuthenticated && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <img
                src="/src/__create/favicon.png"
                alt="Veltrain Logo"
                className="h-16 w-16 mx-auto mb-4"
              />
              <h1 className="text-3xl font-bold text-amber-700 mb-2">Veltrain</h1>
              <p className="text-gray-600">Your private file intelligence workspace</p>
            </div>

            <div className="bg-amber-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-amber-900 mb-4">
                Continue Your Journey
              </h2>
              <p className="text-amber-700 mb-6">
                Your guest session has ended. Login to save your work and continue managing your files securely.
              </p>
              
              <SignInButton mode="modal">
                <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition shadow-md hover:shadow-lg mb-4">
                  Login to Continue
                </button>
              </SignInButton>
              
             
              
              {/* Debug button - remove in production
              {process.env.NODE_ENV === 'development' && (
                <button 
                  onClick={handleForceClearGuestData}
                  className="mt-4 text-xs text-gray-500 underline"
                >
                  Reset Guest Access (Dev Only)
                </button>
              )} */}
            </div>

            <div className="text-xs text-gray-500">
              <p>🔒 All your data stays private on your device</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/src/__create/favicon.png"
                alt="Veltrain Logo"
                className="h-8 w-8"
              />
              <h1 className="text-xl font-bold text-amber-700">Veltrain</h1>
            </div>
            
            {isAuthenticated ? (
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
            {success}
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-amber-900">
              Your Files ({files.length})
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handleExportBackupWrapper}
                disabled={isLoading || (!isAuthenticated && showLoginSplash) || (isAuthenticated && !encryptionKey)}
                className="inline-flex items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                Export Backup
              </button>
              <label className={`inline-flex items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${(isLoading || (!isAuthenticated && showLoginSplash) || (isAuthenticated && !encryptionKey)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                Import Backup
                <input
                  type="file"
                  ref={backupInputRef}
                  onChange={handleImportBackupWrapper}
                  accept=".backup,.json"
                  className="hidden"
                  disabled={isLoading || (!isAuthenticated && showLoginSplash) || (isAuthenticated && !encryptionKey)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <UploadArea
          onFileUpload={handleFileUploadWrapper}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          fileInputRef={fileInputRef}
        />

        {/* Files List */}
        <FileList
          files={files}
          onPreview={handlePreviewWrapper}
          onExport={handleExportWrapper}
          onDelete={handleDeleteWrapper}
          isLoading={isLoading}
          formatFileSize={formatFileSize}
          formatDate={formatDate}
        />
      </main>

      {/* Preview Modal */}
      <PreviewModal
        previewFile={previewFile}
        previewUrl={previewUrl}
        isLoading={isLoading}
        onClose={closePreview}
        onDownload={() => {
          // Download is handled within the PreviewModal component
        }}
      />

      {/* Passphrase Setup Modal - Only show for authenticated users */}
      {showPassphraseSetup && isAuthenticated && (
        <PassphraseSetupModal
          onSetupComplete={handleSetupPassphrase}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}