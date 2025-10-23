"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { isLoggedIn, logout, getSession } from "@/utils/auth";
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
  const [isClient, setIsClient] = useState(false);
  const [session, setSession] = useState(null);
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
  const dragOverlay = useRef(null);

  // Initialize
  useEffect(() => {
    setIsClient(true);
    if (!isLoggedIn()) {
      window.location.href = "/login";
    } else {
      setSession(getSession());
      loadFiles();
    }
  }, []);

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
      setTimeout(() => setSuccess(""), 3000);
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

          // Save file metadata
          const fileMetadata = {
            name: file.name,
            size: file.size,
            mimeType: file.type,
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
      const url = URL.createObjectURL(blob);
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
  const handleImportBackup = async (backupFile) => {
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

  if (!isClient) return null;

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Passphrase setup screen
  if (showPassphraseSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Set Up Encryption
          </h2>
          <p className="text-gray-600 mb-6">
            Enter a strong passphrase to encrypt your files
          </p>

          <form onSubmit={handleSetupPassphrase} className="space-y-4">
            <div>
              <label
                htmlFor="passphrase"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Encryption Passphrase
              </label>
              <input
                id="passphrase"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter a strong passphrase"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition"
            >
              {isLoading ? "Setting up..." : "Continue"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>🔒 Your passphrase is never stored or sent anywhere</p>
          </div>
        </div>
      </div>
    );
  }

  // Main app screen
  return (
    <div
      className="min-h-screen bg-gray-100"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      <div
        ref={dragOverlay}
        className="hidden fixed inset-0 bg-indigo-500 bg-opacity-50 flex items-center justify-center z-50 pointer-events-none"
      >
        <div className="text-center text-white">
          <p className="text-4xl mb-4">📁</p>
          <p className="text-2xl font-bold">Drop files to upload</p>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Veltrain</h1>
            <p className="text-sm text-gray-600">
              Welcome, {session?.username}!
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Alert messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
            {success}
          </div>
        )}

        {/* Upload area */}
        <div
          className="bg-white rounded-lg shadow-md p-8 mb-8 border-2 border-dashed border-gray-300 hover:border-indigo-500 transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            <p className="text-4xl mb-4">📤</p>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Upload Files
            </h2>
            <p className="text-gray-600 mb-4">
              Drag and drop files here or click to select
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
            >
              Choose Files
            </button>
          </div>

          {isUploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {/* File list */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Files ({files.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleExportBackup}
                disabled={isLoading || files.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition text-sm"
              >
                Export Backup
              </button>
              <button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".backup";
                  input.onchange = (e) => {
                    if (e.target.files?.[0]) {
                      handleImportBackup(e.target.files[0]);
                    }
                  };
                  input.click();
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm"
              >
                Import Backup
              </button>
            </div>
          </div>

          {files.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No files yet</p>
              <p className="text-sm">Upload files to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr
                      key={file.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium truncate">
                        {file.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {file.mimeType || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(file.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handlePreview(file)}
                          disabled={isLoading}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-xs transition"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleExportFile(file)}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-xs transition"
                        >
                          Export
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-xs transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Preview modal */}
      {previewFile && previewUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setPreviewFile(null);
            setPreviewUrl("");
          }}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {previewFile.name}
                </h3>
                <button
                  onClick={() => {
                    setPreviewFile(null);
                    setPreviewUrl("");
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {previewFile.mimeType?.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt={previewFile.name}
                  className="w-full"
                />
              ) : previewFile.mimeType?.startsWith("text/") ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-96 border border-gray-200 rounded"
                  title={previewFile.name}
                />
              ) : previewFile.mimeType === "application/pdf" ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-96 border border-gray-200 rounded"
                  title={previewFile.name}
                />
              ) : (
                <div className="p-4 bg-gray-100 rounded text-center text-gray-600">
                  <p>Preview not available for this file type</p>
                  <button
                    onClick={() => handleExportFile(previewFile)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Download to view
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
