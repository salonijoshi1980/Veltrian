"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth, useUser } from "@/utils/clerkAuth";
import { SignOutButton } from "@clerk/clerk-react";
import {
  deriveKey,
  chunkFile,
  encryptChunk,
  decryptChunk,
  reconstructFile,
} from "@/utils/crypto";
import {
  saveFileMetadata,
  saveChunk,
  getAllFiles,
  getFileChunks,
  deleteFile,
  exportBackupData,
  importBackupData,
} from "@/utils/db";

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
  const [showPassphraseSetup, setShowPassphraseSetup] = useState(true);

  // File management state
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Preview state
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fileInputRef = useRef(null);
  const backupInputRef = useRef(null);
  const dragOverlay = useRef(null);

  // Initialize
  useEffect(() => {
    setIsClient(true);

    // Redirect unauthenticated users to login
    if (isLoaded && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isLoaded, isAuthenticated]);

  // Check if we need to show encryption setup or restore key
  useEffect(() => {
    if (isAuthenticated && isLoaded) {
      // Check if encryption key is already set in session storage
      const keySet = sessionStorage.getItem("encryptionKeySet");
      const savedPassphrase = sessionStorage.getItem("encryptionPassphrase");

      if (keySet && savedPassphrase) {
        // Restore the encryption key from the saved passphrase
        deriveKey(savedPassphrase)
          .then((key) => {
            setEncryptionKey(key);
            setShowPassphraseSetup(false);
            loadFiles();
          })
          .catch((error) => {
            console.error("Error restoring encryption key:", error);
            // If we can't restore the key, show setup again
            setShowPassphraseSetup(true);
            sessionStorage.removeItem("encryptionKeySet");
            sessionStorage.removeItem("encryptionPassphrase");
          });
      } else {
        setShowPassphraseSetup(true);
      }
    }
  }, [isAuthenticated, isLoaded]);

  // Load files from IndexedDB
  const loadFiles = async () => {
    try {
      const fileList = await getAllFiles();
      setFiles(fileList);
    } catch (err) {
      console.error("Error loading files:", err);
      setError("Failed to load files");
    }
  };

  // Setup encryption key from passphrase
  const handleSetupPassphrase = async (e) => {
    e.preventDefault();
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

      // Store in session storage for persistence
      sessionStorage.setItem("encryptionKeySet", "true");
      sessionStorage.setItem("encryptionPassphrase", passphrase);

      setTimeout(() => setSuccess(""), 3000);
      await loadFiles();
    } catch (err) {
      console.error("Error setting up passphrase:", err);
      setError("Failed to set up encryption");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = useCallback(
    async (fileList) => {
      if (!encryptionKey) {
        setError("Please set up your passphrase first");
        return;
      }

      setIsUploading(true);
      setError("");
      setSuccess("");
      let uploadedCount = 0;

      try {
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          const totalFiles = fileList.length;

          setUploadProgress(Math.round((i / totalFiles) * 100));

          // Chunk the file
          const chunks = await chunkFile(file);

          // Save file metadata with proper MIME type detection
          const fileMetadata = {
            name: file.name,
            size: file.size,
            mimeType: file.type || "application/octet-stream", // Default to binary if no type
            createdAt: new Date().toISOString(),
            totalChunks: chunks.length,
          };

          const fileId = await saveFileMetadata(fileMetadata);

          // Encrypt and save each chunk with batch processing to prevent stack overflow
          for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
            const { iv, ciphertext } = await encryptChunk(
              chunks[chunkIndex],
              encryptionKey
            );

            await saveChunk({
              fileId,
              chunkIndex,
              iv,
              ciphertext,
            });

            // Add a small delay every 10 chunks to prevent blocking the UI
            if (chunkIndex % 10 === 0) {
              await new Promise((resolve) => setTimeout(resolve, 0));
            }
          }

          uploadedCount++;
        }

        setUploadProgress(100);
        setSuccess(`Successfully uploaded ${uploadedCount} file(s)!`);
        setUploadProgress(0);
        setTimeout(() => setSuccess(""), 3000);

        // Reload files
        await loadFiles();
      } catch (err) {
        console.error("Error uploading files:", err);
        setError(`Failed to upload files: ${err.message}`);
      } finally {
        setIsUploading(false);
      }
    },
    [encryptionKey]
  );

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverlay.current) {
      dragOverlay.current.style.display = "flex";
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === dragOverlay.current) {
      dragOverlay.current.style.display = "none";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverlay.current) {
      dragOverlay.current.style.display = "none";
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Preview file
  const handlePreview = async (file) => {
    if (!encryptionKey) return;

    setError("");
    setIsLoading(true);

    try {
      const chunks = await getFileChunks(file.id);
      const decryptedChunks = [];

      for (const chunk of chunks) {
        const decrypted = await decryptChunk(
          chunk.iv,
          chunk.ciphertext,
          encryptionKey
        );
        decryptedChunks.push(decrypted);
      }

      const blob = reconstructFile(decryptedChunks, file.mimeType);

      // Create a more robust URL for the blob
      const url = URL.createObjectURL(blob);

      // For PDFs, we might need to ensure proper handling
      if (file.mimeType === "application/pdf") {
        // Add a small delay to ensure blob is ready
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setPreviewFile(file);
      setPreviewUrl(url);
    } catch (err) {
      console.error("Error previewing file:", err);
      setError("Failed to preview file");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete file
  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    setError("");
    setIsLoading(true);

    try {
      await deleteFile(fileId);
      setSuccess("File deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      await loadFiles();
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Failed to delete file");
    } finally {
      setIsLoading(false);
    }
  };

  // Export file
  const handleExportFile = async (file) => {
    if (!encryptionKey) return;

    setError("");
    setIsLoading(true);

    try {
      const chunks = await getFileChunks(file.id);
      const decryptedChunks = [];

      for (const chunk of chunks) {
        const decrypted = await decryptChunk(
          chunk.iv,
          chunk.ciphertext,
          encryptionKey
        );
        decryptedChunks.push(decrypted);
      }

      const blob = reconstructFile(decryptedChunks, file.mimeType);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess("File exported successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error exporting file:", err);
      setError("Failed to export file");
    } finally {
      setIsLoading(false);
    }
  };

  // Export backup
  const handleExportBackup = async () => {
    setError("");
    setIsLoading(true);

    try {
      const backupBlob = await exportBackupData();
      const url = URL.createObjectURL(backupBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `veltrain-backup-${new Date().toISOString().split("T")[0]}.backup`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess("Backup exported successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error exporting backup:", err);
      setError(`Failed to export backup: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Import backup
  const handleImportBackup = async (e) => {
    const backupFile = e.target.files[0];
    if (!backupFile) return;

    setError("");
    setIsLoading(true);

    try {
      await importBackupData(backupFile);
      setSuccess("Backup imported successfully!");
      setTimeout(() => setSuccess(""), 3000);
      await loadFiles();
    } catch (err) {
      console.error("Error importing backup:", err);
      setError("Failed to import backup");
    } finally {
      setIsLoading(false);
      // Reset input
      if (backupInputRef.current) {
        backupInputRef.current.value = "";
      }
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    return (
      new Date(dateString).toLocaleDateString() +
      " " +
      new Date(dateString).toLocaleTimeString()
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

  if (!isClient || !isLoaded) return null;

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Passphrase setup screen
  if (showPassphraseSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full border border-amber-200">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/src/__create/favicon.png"
              alt="Veltrain Logo"
              className="h-20 w-20 mr-3"
            />
            <h2 className="text-2xl font-bold text-amber-900">Veltrain</h2>
          </div>
          <p className="text-amber-700 mb-6">
            Enter a strong passphrase to encrypt your files
          </p>

          <form onSubmit={handleSetupPassphrase} className="space-y-4">
            <div>
              <label
                htmlFor="passphrase"
                className="block text-sm font-medium text-amber-800 mb-2"
              >
                Encryption Passphrase
              </label>
              <input
                id="passphrase"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter a strong passphrase"
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
              {error && (
                <div className="mt-2 text-sm text-red-600">{error}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-amber-900 font-medium py-2 rounded-lg transition"
            >
              {isLoading ? "Setting up..." : "Continue"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-amber-200 text-center text-xs text-amber-600">
            <p>🔒 Your passphrase is never stored or sent anywhere</p>
          </div>
        </div>
      </div>
    );
  }

  // Main app screen
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
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-amber-800">
                Hello,{" "}
                {user?.firstName || user?.username || user?.email || "User"}!
              </span>
              <SignOutButton>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-900 bg-amber-200 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                  Logout
                </button>
              </SignOutButton>
            </div>
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
                onClick={handleExportBackup}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                Export Backup
              </button>
              <label className="inline-flex items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 cursor-pointer disabled:opacity-50">
                Import Backup
                <input
                  type="file"
                  ref={backupInputRef}
                  onChange={handleImportBackup}
                  accept=".backup,.json"
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className="mb-8 border-2 border-dashed border-amber-300 rounded-lg p-8 text-center hover:border-amber-500 transition relative bg-white"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <svg
              className="mx-auto h-12 w-12 text-amber-500"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-amber-900">
              Upload Files
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              Drag and drop files here or click to select
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-amber-900 bg-amber-400 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Choose Files
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />

          {/* Drag overlay */}
          <div
            ref={dragOverlay}
            className="absolute inset-0 bg-amber-500/10 border-2 border-dashed border-amber-400 rounded-lg flex items-center justify-center hidden"
          >
            <div className="text-amber-700 font-medium">Drop files here</div>
          </div>

          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-amber-700 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Files List */}
        {files.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md border border-amber-200">
            <ul className="divide-y divide-amber-100">
              {files.map((file) => (
                <li key={file.id}>
                  <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-md flex items-center justify-center">
                        <svg
                          className="h-6 w-6 text-amber-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-amber-900">
                          {file.name}
                        </div>
                        <div className="flex space-x-4 text-sm text-amber-600">
                          <span>{formatFileSize(file.size)}</span>
                          <span>{file.mimeType || "Unknown"}</span>
                          <span>{formatDate(file.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreview(file)}
                        disabled={isLoading}
                        className="inline-flex items-center px-3 py-1 border border-amber-300 text-sm font-medium rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-50"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleExportFile(file)}
                        disabled={isLoading}
                        className="inline-flex items-center px-3 py-1 border border-amber-300 text-sm font-medium rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-50"
                      >
                        Export
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        disabled={isLoading}
                        className="inline-flex items-center px-3 py-1 border border-amber-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-amber-200">
            <svg
              className="mx-auto h-12 w-12 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-amber-900">
              No files
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              Get started by uploading a new file.
            </p>
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-amber-300">
            <div className="px-4 py-3 border-b border-amber-200 flex justify-between items-center bg-amber-50">
              <h3 className="text-lg font-medium text-amber-900">
                Preview: {previewFile.name}
              </h3>
              <button
                onClick={closePreview}
                className="text-amber-600 hover:text-amber-800"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {previewFile.mimeType?.startsWith("text/") ||
                  previewFile.mimeType === "application/json" ? (
                    <iframe
                      src={previewUrl}
                      className="flex-1 w-full border rounded border-amber-200"
                      title={`Preview of ${previewFile.name}`}
                      onError={(e) => {
                        console.error("Preview failed for text file:", e);
                        // Fallback to download if preview fails
                        e.target.style.display = "none";
                      }}
                    />
                  ) : previewFile.mimeType === "application/pdf" ? (
                    <embed
                      src={previewUrl}
                      type="application/pdf"
                      className="flex-1 w-full"
                      onError={(e) => {
                        console.error("Preview failed for PDF:", e);
                        // Fallback to download if preview fails
                        e.target.style.display = "none";
                      }}
                    />
                  ) : previewFile.mimeType?.startsWith("image/") ? (
                    <img
                      src={previewUrl}
                      alt={`Preview of ${previewFile.name}`}
                      className="max-w-full max-h-full mx-auto"
                      onError={(e) => {
                        console.error("Preview failed for image:", e);
                        // Fallback to download if preview fails
                        e.target.style.display = "none";
                      }}
                    />
                  ) : previewFile.mimeType?.startsWith("video/") ? (
                    <video
                      src={previewUrl}
                      controls
                      className="max-w-full max-h-full mx-auto"
                      onError={(e) => {
                        console.error("Preview failed for video:", e);
                        // Fallback to download if preview fails
                        e.target.style.display = "none";
                      }}
                    />
                  ) : previewFile.mimeType?.startsWith("audio/") ? (
                    <audio
                      src={previewUrl}
                      controls
                      className="w-full mt-8"
                      onError={(e) => {
                        console.error("Preview failed for audio:", e);
                        // Fallback to download if preview fails
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                      <svg
                        className="mx-auto h-12 w-12 text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-amber-900">
                        Preview not available
                      </h3>
                      <p className="mt-1 text-sm text-amber-700">
                        This file type cannot be previewed directly.
                      </p>
                      <div className="mt-6">
                        <a
                          href={previewUrl}
                          download={previewFile.name}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-amber-900 bg-amber-400 hover:bg-amber-500"
                        >
                          Download File
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
