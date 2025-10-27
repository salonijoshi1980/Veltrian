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
  const loadFiles = useCallback(
    async (setFiles, setError, showUnencryptedOnly = false) => {
      try {
        const fileList = await getAllFiles();

        // Filter files based on user status:
        // - When not logged in (guest): show only unencrypted files
        // - When logged in with encryption: show all files
        const filteredFiles = showUnencryptedOnly
          ? fileList.filter((file) => file.encrypted === false)
          : fileList;

        setFiles(filteredFiles);
      } catch (err) {
        console.error("Error loading files:", err);
        if (setError) setError("Failed to load files");
      }
    },
    []
  );

  // Function to re-encrypt existing unencrypted files by converting back to file and re-uploading
  const reEncryptUnencryptedFiles = useCallback(
    async (setSuccess, setError, encryptionKeyParam) => {
      // Use the passed encryption key or fallback to the hook's encryptionKey
      const keyToUse = encryptionKeyParam || encryptionKey;

      console.log(
        "reEncryptUnencryptedFiles called with keyToUse:",
        !!keyToUse
      );

      if (!keyToUse) {
        console.log("No encryption key available, skipping re-encryption");
        return;
      }

      try {
        const allFiles = await getAllFiles();
        console.log("All files:", allFiles);
        const unencryptedFiles = allFiles.filter(
          (file) => file.encrypted === false
        );
        console.log("Unencrypted files found:", unencryptedFiles.length);

        if (unencryptedFiles.length === 0) {
          console.log("No unencrypted files to re-encrypt");
          return;
        }

        let reEncryptedCount = 0;

        for (const file of unencryptedFiles) {
          try {
            console.log("Re-encrypting file:", file.name);
            // Get all chunks for this file
            const chunks = await getFileChunks(file.id);
            console.log(`File ${file.name} has ${chunks.length} chunks`);

            // Reconstruct the original file from unencrypted chunks
            const decryptedChunks = [];
            for (const chunk of chunks) {
              if (!chunk.encrypted && chunk.data) {
                // Convert stored array back to Uint8Array
                const dataArray = new Uint8Array(chunk.data);
                decryptedChunks.push(dataArray);
              }
            }

            // Reconstruct the file
            const reconstructedFile = reconstructFile(
              decryptedChunks,
              file.mimeType
            );

            // Create a proper File object (not just a Blob) to work with chunkFile
            // We can't directly set properties on Blob, so we create a new File
            const fileForChunking = new File([reconstructedFile], file.name, {
              type: file.mimeType,
              lastModified: new Date(file.createdAt).getTime(),
            });

            console.log("File reconstructed successfully");

            // Chunk the file again
            const fileChunks = await chunkFile(fileForChunking);
            console.log("File re-chunked:", fileChunks.length, "chunks");

            // Save new file metadata with encryption flag set to true
            const newFileMetadata = {
              name: file.name,
              size: file.size,
              mimeType: file.mimeType,
              createdAt: file.createdAt, // Keep original creation time
              totalChunks: fileChunks.length,
              encrypted: true, // Mark as encrypted
            };

            const newFileId = await saveFileMetadata(newFileMetadata);
            console.log("New file metadata saved with ID:", newFileId);

            // Process each chunk - encrypt with the encryption key
            for (
              let chunkIndex = 0;
              chunkIndex < fileChunks.length;
              chunkIndex++
            ) {
              const chunkData = fileChunks[chunkIndex];

              // Encrypt chunk
              const { iv, ciphertext } = await encryptChunk(
                chunkData,
                keyToUse
              );

              const encryptedChunkData = {
                fileId: newFileId,
                chunkIndex,
                iv,
                ciphertext,
                encrypted: true,
              };

              await saveChunk(encryptedChunkData);
              console.log("Encrypted chunk", chunkIndex, "saved");
            }

            // Delete the old unencrypted file and its chunks
            await deleteFile(file.id);
            console.log("Old unencrypted file deleted:", file.id);

            reEncryptedCount++;
            console.log(`Re-encrypted file ${file.name}`);
          } catch (fileError) {
            console.error(
              `Error re-encrypting file ${file.name} (ID: ${file.id}):`,
              fileError
            );
            // Continue with other files even if one fails
          }
        }

        if (reEncryptedCount > 0) {
          const message = `Re-encrypted ${reEncryptedCount} file(s)!`;
          console.log(message);
          setSuccess(message);
        } else {
          console.log("No files were successfully re-encrypted");
        }
      } catch (err) {
        console.error("Error re-encrypting files:", err);
        setError("Failed to re-encrypt existing files");
      }
    },
    [encryptionKey]
  );

  const handleFileUpload = useCallback(
    async (
      fileList,
      setIsUploading,
      setError,
      setSuccess,
      setUploadProgress,
      loadFiles
    ) => {
      // REMOVED encryption key check - allow upload without encryption for guest users

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
            mimeType: file.type || "application/octet-stream",
            createdAt: new Date().toISOString(),
            totalChunks: fileChunks.length,
            encrypted: !!encryptionKey, // Track if file is encrypted
          };

          const fileId = await saveFileMetadata(fileMetadata);

          // Process each chunk - encrypt if encryptionKey exists, otherwise store as plain text
          for (
            let chunkIndex = 0;
            chunkIndex < fileChunks.length;
            chunkIndex++
          ) {
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
            setUploadProgress(
              Math.round((totalChunksProcessed / totalChunks) * 100)
            );

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
      // REMOVED encryption key requirement

      setError("");
      setIsLoading(true);

      try {
        const chunks = await getFileChunks(file.id);
        const decryptedChunks = [];

        for (const chunk of chunks) {
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

          decryptedChunks.push(decrypted);
        }

        const blob = reconstructFile(decryptedChunks, file.mimeType);
        const url = URL.createObjectURL(blob);

        if (file.mimeType === "application/pdf") {
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

      try {
        await deleteFile(fileId);
        setSuccess("File deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
        await loadFiles();
      } catch (err) {
        console.error("Error deleting file:", err);
        setError("Failed to delete file");
      }
    },
    []
  );

  const handleExportFile = useCallback(
    async (file, setSuccess, setError, setIsLoading) => {
      // REMOVED encryption key requirement

      setError("");
      setIsLoading(true);

      try {
        const chunks = await getFileChunks(file.id);
        const decryptedChunks = [];

        for (const chunk of chunks) {
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
    reEncryptUnencryptedFiles,
  };
}
