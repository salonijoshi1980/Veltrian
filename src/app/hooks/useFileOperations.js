import { useCallback } from "react";
import {
  saveFileMetadata,
  saveChunk,
  getAllFiles,
  getFileChunks,
  deleteFile,
  exportBackupData,
  importBackupData,
} from "@/utils/db";
import {
  chunkFile,
  encryptChunk,
  decryptChunk,
  reconstructFile,
} from "@/utils/crypto";

export function useFileOperations(encryptionKey) {
  const loadFiles = useCallback(async (setFiles, setError) => {
    try {
      const fileList = await getAllFiles();
      setFiles(fileList);
    } catch (err) {
      console.error("Error loading files:", err);
      if (setError) setError("Failed to load files");
    }
  }, []);

  const handleFileUpload = useCallback(
    async (
      fileList,
      setIsUploading,
      setError,
      setSuccess,
      setUploadProgress,
      loadFiles
    ) => {
<<<<<<< HEAD
      // REMOVED encryption key check - allow upload without encryption for guest users
=======
      if (!encryptionKey) {
        setError("Please set up your passphrase first");
        return;
      }
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac

      setIsUploading(true);
      setError("");
      setSuccess("");
      let uploadedCount = 0;
      let totalChunksProcessed = 0;
      let totalChunks = 0;

      // Calculate total chunks across all files
      for (let i = 0; i < fileList.length; i++) {
        const chunks = await chunkFile(fileList[i]);
        totalChunks += chunks.length;
      }

      try {
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          const fileChunks = await chunkFile(file);

          // Save file metadata with proper MIME type detection
          const fileMetadata = {
            name: file.name,
            size: file.size,
<<<<<<< HEAD
            mimeType: file.type || "application/octet-stream",
            createdAt: new Date().toISOString(),
            totalChunks: fileChunks.length,
            encrypted: !!encryptionKey, // Track if file is encrypted
=======
            mimeType: file.type || "application/octet-stream", // Default to binary if no type
            createdAt: new Date().toISOString(),
            totalChunks: fileChunks.length,
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
          };

          const fileId = await saveFileMetadata(fileMetadata);

<<<<<<< HEAD
          // Process each chunk - encrypt if encryptionKey exists, otherwise store as plain text
=======
          // Encrypt and save each chunk with batch processing to prevent stack overflow
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
          for (
            let chunkIndex = 0;
            chunkIndex < fileChunks.length;
            chunkIndex++
          ) {
<<<<<<< HEAD
            let chunkData;
            
            if (encryptionKey) {
              // Encrypt chunk for authenticated users
              const { iv, ciphertext } = await encryptChunk(
                fileChunks[chunkIndex],
                encryptionKey
              );
              chunkData = {
                fileId,
                chunkIndex,
                iv,
                ciphertext,
                encrypted: true,
              };
            } else {
              // Store plain text for guest users - convert Uint8Array to array for storage
              const dataArray = Array.from(fileChunks[chunkIndex]);
              chunkData = {
                fileId,
                chunkIndex,
                data: dataArray, // Store as array for JSON serialization
                encrypted: false,
              };
            }

            await saveChunk(chunkData);

            totalChunksProcessed++;
=======
            const { iv, ciphertext } = await encryptChunk(
              fileChunks[chunkIndex],
              encryptionKey
            );

            await saveChunk({
              fileId,
              chunkIndex,
              iv,
              ciphertext,
            });

            totalChunksProcessed++;
            // Update progress based on chunks processed
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
            setUploadProgress(
              Math.round((totalChunksProcessed / totalChunks) * 100)
            );

<<<<<<< HEAD
=======
            // Add a small delay every 10 chunks to prevent blocking the UI
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
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

<<<<<<< HEAD
=======
        // Reload files
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
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

  const handlePreview = useCallback(
    async (file, setPreviewFile, setPreviewUrl, setIsLoading, setError) => {
<<<<<<< HEAD
      // REMOVED encryption key requirement
=======
      if (!encryptionKey) return;
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac

      setError("");
      setIsLoading(true);

      try {
        const chunks = await getFileChunks(file.id);
        const decryptedChunks = [];

        for (const chunk of chunks) {
<<<<<<< HEAD
          let decrypted;
          
          if (chunk.encrypted && encryptionKey) {
            // Decrypt encrypted chunks
            decrypted = await decryptChunk(
              chunk.iv,
              chunk.ciphertext,
              encryptionKey
            );
          } else if (!chunk.encrypted && chunk.data) {
            // Use plain data for guest files - convert array back to Uint8Array
            decrypted = new Uint8Array(chunk.data);
          } else {
            throw new Error("Invalid chunk data");
          }
          
=======
          const decrypted = await decryptChunk(
            chunk.iv,
            chunk.ciphertext,
            encryptionKey
          );
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
          decryptedChunks.push(decrypted);
        }

        const blob = reconstructFile(decryptedChunks, file.mimeType);
<<<<<<< HEAD
        const url = URL.createObjectURL(blob);

        if (file.mimeType === "application/pdf") {
=======

        // Revoke previous preview URL before setting a new one
        // Create a more robust URL for the blob
        const url = URL.createObjectURL(blob);

        // For PDFs, we might need to ensure proper handling
        if (file.mimeType === "application/pdf") {
          // Add a small delay to ensure blob is ready
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
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
    },
    [encryptionKey]
  );

  const handleDelete = useCallback(
    async (fileId, setSuccess, setError, loadFiles) => {
      if (!window.confirm("Are you sure you want to delete this file?")) return;

      setError("");
<<<<<<< HEAD
=======
      // setIsLoading(true); // We're not using setIsLoading here to avoid UI blocking
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac

      try {
        await deleteFile(fileId);
        setSuccess("File deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
        await loadFiles();
      } catch (err) {
        console.error("Error deleting file:", err);
        setError("Failed to delete file");
<<<<<<< HEAD
=======
      } finally {
        // setIsLoading(false);
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
      }
    },
    []
  );

  const handleExportFile = useCallback(
    async (file, setSuccess, setError, setIsLoading) => {
<<<<<<< HEAD
      // REMOVED encryption key requirement
=======
      if (!encryptionKey) return;
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac

      setError("");
      setIsLoading(true);

      try {
        const chunks = await getFileChunks(file.id);
        const decryptedChunks = [];

        for (const chunk of chunks) {
<<<<<<< HEAD
          let decrypted;
          
          if (chunk.encrypted && encryptionKey) {
            decrypted = await decryptChunk(
              chunk.iv,
              chunk.ciphertext,
              encryptionKey
            );
          } else if (!chunk.encrypted && chunk.data) {
            decrypted = new Uint8Array(chunk.data);
          } else {
            throw new Error("Invalid chunk data");
          }
          
=======
          const decrypted = await decryptChunk(
            chunk.iv,
            chunk.ciphertext,
            encryptionKey
          );
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
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
    },
    [encryptionKey]
  );

  const handleExportBackup = useCallback(
    async (setIsLoading, setError, setSuccess) => {
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
    },
    []
  );

  const handleImportBackup = useCallback(
    async (
      e,
      setSuccess,
      setError,
      setIsLoading,
      loadFiles,
      backupInputRef
    ) => {
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
<<<<<<< HEAD
=======
        // Reset input
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
        if (backupInputRef.current) {
          backupInputRef.current.value = "";
        }
      }
    },
    []
  );

  return {
    loadFiles,
    handleFileUpload,
    handlePreview,
    handleDelete,
    handleExportFile,
    handleExportBackup,
    handleImportBackup,
  };
<<<<<<< HEAD
}
=======
}
>>>>>>> ef34e2aceec70c9fb72b58810f1b5e7647a4d5ac
