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

  // Custom hooks
  const {
    loadFiles,
    handleFileUpload,
    handlePreview,
    handleDelete,
    handleExportFile,
    handleExportBackup,
    handleImportBackup,
  } = useFileOperations(encryptionKey);

  const { formatFileSize, formatDate } = useFormatting();

  // Initialize
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if we need to show encryption setup or restore key
  useEffect(() => {
    if (isAuthenticated && isLoaded) {
      // Only show passphrase setup for authenticated users
      setShowPassphraseSetup(true);
    } else {
      // Reset encryption state for unauthenticated users
      setEncryptionKey(null);
      setShowPassphraseSetup(false);
      setFiles([]);
    }
  }, [isAuthenticated, isLoaded]);

  // Load files from IndexedDB only when authenticated and encryption is set
  useEffect(() => {
    if (isAuthenticated && isLoaded && encryptionKey) {
      loadFiles(setFiles, setError);
    }
  }, [isAuthenticated, isLoaded, encryptionKey, loadFiles]);

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

      // Do not persist passphrase; keep key only in memory
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
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUploadWrapper(files);
    }
  };

  const handleFileUploadWrapper = (files) => {
    // Check authentication before upload
    if (!isAuthenticated) {
      setError("Please login to upload files");
      return;
    }
    
    // Check encryption setup before upload
    if (!encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }

    handleFileUpload(
      files,
      setIsUploading,
      setError,
      setSuccess,
      setUploadProgress,
      () => loadFiles(setFiles, setError)
    );
  };

  // Handle backup operations with auth check
  const handleExportBackupWrapper = () => {
    if (!isAuthenticated) {
      setError("Please login to export backups");
      return;
    }
    if (!encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }
    handleExportBackup(setIsLoading, setError, setSuccess);
  };

  const handleImportBackupWrapper = (e) => {
    if (!isAuthenticated) {
      setError("Please login to import backups");
      return;
    }
    if (!encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }
    handleImportBackup(
      e,
      setSuccess,
      setError,
      setIsLoading,
      () => loadFiles(setFiles, setError),
      backupInputRef
    );
  };

  // Handle file operations with auth check
  const handlePreviewWrapper = (file) => {
    if (!isAuthenticated) {
      setError("Please login to preview files");
      return;
    }
    if (!encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }
    handlePreview(
      file,
      setPreviewFile,
      setPreviewUrl,
      setIsLoading,
      setError
    );
  };

  const handleExportWrapper = (file) => {
    if (!isAuthenticated) {
      setError("Please login to export files");
      return;
    }
    if (!encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }
    handleExportFile(file, setSuccess, setError, setIsLoading);
  };

  const handleDeleteWrapper = (fileId) => {
    if (!isAuthenticated) {
      setError("Please login to delete files");
      return;
    }
    if (!encryptionKey) {
      setError("Please set up your encryption passphrase first");
      return;
    }
    handleDelete(fileId, setSuccess, setError, () =>
      loadFiles(setFiles, setError)
    );
  };

  // Close preview
  const closePreview = () => {
    if (previewUrl) {
      // Revoke the blob URL to free memory
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
                    Login to Upload
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
                disabled={isLoading || !isAuthenticated || !encryptionKey}
                className="inline-flex items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                Export Backup
              </button>
              <label className={`inline-flex items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${(!isAuthenticated || !encryptionKey || isLoading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                Import Backup
                <input
                  type="file"
                  ref={backupInputRef}
                  onChange={handleImportBackupWrapper}
                  accept=".backup,.json"
                  className="hidden"
                  disabled={isLoading || !isAuthenticated || !encryptionKey}
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