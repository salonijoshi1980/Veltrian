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
  const [extendedGuestMode, setExtendedGuestMode] = useState(false);

  // Encryption state
  const [passphrase, setPassphrase] = useState("");
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [showPassphraseSetup, setShowPassphraseSetup] = useState(false);

  // File management state
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUploadFile, setCurrentUploadFile] = useState(null);

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
  const EXTENDED_GUEST_KEY = 'veltrain_extended_guest';
  const GUEST_BACKUP_REMINDER_KEY = 'veltrain_guest_backup_reminder';

  // Initialize
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check extended guest mode
  const isExtendedGuestMode = () => {
    return localStorage.getItem(EXTENDED_GUEST_KEY) === 'true';
  };

  // Set extended guest mode
  const setExtendedGuestModeFlag = (value) => {
    if (value) {
      localStorage.setItem(EXTENDED_GUEST_KEY, 'true');
    } else {
      localStorage.removeItem(EXTENDED_GUEST_KEY);
    }
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

  // Clear guest files from IndexedDB when session ends
  const clearGuestFiles = async () => {
    if (!isAuthenticated) {
      try {
        // Clear all files for guest users
        const currentFiles = await guestFileOperations.loadFiles(setFiles, setError);
        if (currentFiles && currentFiles.length > 0) {
          // Delete all guest files
          for (const file of currentFiles) {
            await guestFileOperations.handleDelete(file.id, setSuccess, setError, () => {});
          }
        }
        setFiles([]);
      } catch (error) {
        console.error("Error clearing guest files:", error);
      }
    }
  };

  // Start guest access timer when user accesses the app without login
  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      // Check if user is in extended guest mode
      if (isExtendedGuestMode()) {
        setExtendedGuestMode(true);
        setGuestAccessActive(true);
        setShowLoginSplash(false);
        loadGuestFiles();
        return;
      }

      // Check if guest access has expired
      if (hasGuestAccessExpired()) {
        setShowLoginSplash(true);
        setGuestAccessActive(false);
        return;
      }

      const guestData = getGuestAccessData();
      
      if (!guestData) {
        // First visit - grant 2 minutes access
        const expiresAt = Date.now() + (2 * 60 * 1000);
        setGuestAccessData(expiresAt, 0);
        setGuestAccessActive(true);
        startGuestAccessTimer();
        loadGuestFiles();
      } else {
        // Valid guest access
        setGuestAccessActive(true);
        startGuestAccessTimer();
        loadGuestFiles();
      }
    } else {
      // Clear guest data when user logs in
      clearGuestAccessData();
      setExtendedGuestModeFlag(false);
      setExtendedGuestMode(false);
      setGuestAccessActive(false);
      setShowLoginSplash(false);
    }

    return () => {
      if (guestTimerRef.current) {
        clearTimeout(guestTimerRef.current);
      }
    };
  }, [isLoaded, isAuthenticated]);

  // Clear guest files when component unmounts or user leaves
  useEffect(() => {
    return () => {
      if (!isAuthenticated) {
        // Clear guest files when user leaves the page
        clearGuestFiles();
      }
    };
  }, [isAuthenticated]);

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
      // Clear guest files when timer expires
      clearGuestFiles();
    }, timeLeft);
  };

  // Handle continue as guest
  const handleContinueAsGuest = () => {
    setExtendedGuestMode(true);
    setExtendedGuestModeFlag(true);
    setShowLoginSplash(false);
    setGuestAccessActive(true);
    setError("You're in extended guest mode. Export your backup to save your work - it will be lost when you leave!");
    
    // Clear the error after 5 seconds
    setTimeout(() => setError(""), 5000);
  };

  // Reset guest timer on user interaction
  const resetGuestTimer = () => {
    if (!isAuthenticated && guestAccessActive && !extendedGuestMode) {
      startGuestAccessTimer();
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
    // Check if we're in extended guest mode and show warning
    if (!isAuthenticated && extendedGuestMode) {
      setError("⚠️ Guest Mode: Export your backup to save your work. Files will be lost when you leave!");
      setTimeout(() => setError(""), 7000);
    }

    resetGuestTimer();

    const fileOps = isAuthenticated ? authFileOperations : guestFileOperations;
    
    if (isAuthenticated && !encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }

    // Set current upload file for progress display
    if (files.length > 0) {
      setCurrentUploadFile(files[0].name);
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
        // Reset upload state
        setCurrentUploadFile(null);
        setUploadProgress(0);
      }
    );
  };

  // Handle backup operations - ENABLED for guest users to export their work
  const handleExportBackupWrapper = () => {
    resetGuestTimer();

    const fileOps = isAuthenticated ? authFileOperations : guestFileOperations;
    
    if (isAuthenticated && !encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }

    fileOps.handleExportBackup(setIsLoading, setError, setSuccess);
  };

  const handleImportBackupWrapper = (e) => {
    // Only allow import for authenticated users
    if (!isAuthenticated) {
      setError("Please login to import backups. Guest users can only export their work.");
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
    resetGuestTimer();

    const fileOps = isAuthenticated ? authFileOperations : guestFileOperations;
    
    fileOps.handleExportFile(file, setSuccess, setError, setIsLoading);
  };

  const handleDeleteWrapper = (fileId) => {
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
                Save Your Work!
              </h2>
              <p className="text-amber-700 mb-6">
                Your guest session has ended. Export your backup to save your work, or login for automatic saving.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleExportBackupWrapper}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition shadow-md hover:shadow-lg"
                >
                  📥 Export Backup & Save Work
                </button>
                
                <SignInButton mode="modal">
                  <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition shadow-md hover:shadow-lg">
                    🔐 Login for Auto-Save
                  </button>
                </SignInButton>
                
                <button
                  onClick={handleContinueAsGuest}
                  className="w-full py-3 border border-amber-500 text-amber-700 hover:bg-amber-50 font-medium rounded-lg transition"
                >
                  ⚠️ Continue as Guest (Unsaved)
                </button>
              </div>
              
              <p className="text-sm text-amber-600 mt-4">
                Don't have an account? Sign up for free
              </p>
            </div>

            <div className="text-xs text-gray-500">
              <p>🔒 Export your backup to never lose your work</p>
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
                {extendedGuestMode && (
                  <div className="flex items-center space-x-2 text-sm text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    <span>⚠️ Export Backup to Save Work</span>
                  </div>
                )}
                <SignInButton mode="modal">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-900 bg-amber-200 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                    Login to Save
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Extended Guest Mode Warning */}
        {extendedGuestMode && !isAuthenticated && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
            <div className="flex items-center">
              <span className="text-lg mr-2">⚠️</span>
              <div>
                <p className="font-medium">Guest Mode - Export Your Backup!</p>
                <p className="text-sm">Your work will be lost when you leave. Export your backup to save it permanently.</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">
                Uploading {currentUploadFile || "file"}...
              </span>
              <span className="text-sm text-blue-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

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
              {extendedGuestMode && !isAuthenticated && (
                <span className="text-sm font-normal text-yellow-600 ml-2">(Temporary - Export to Save)</span>
              )}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handleExportBackupWrapper}
                disabled={isLoading || (isAuthenticated && !encryptionKey)}
                className="inline-flex items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                {!isAuthenticated ? "📥 Export Backup to Save" : "Export Backup"}
              </button>
              <label className={`inline-flex items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${(isLoading || !isAuthenticated || (isAuthenticated && !encryptionKey)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                Import Backup
                <input
                  type="file"
                  ref={backupInputRef}
                  onChange={handleImportBackupWrapper}
                  accept=".backup,.json"
                  className="hidden"
                  disabled={isLoading || !isAuthenticated || (isAuthenticated && !encryptionKey)}
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