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
      if (!encryptionKey) {
        setError("Please set up your passphrase first");
        return;
      }

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
            mimeType: file.type || "application/octet-stream", // Default to binary if no type
            createdAt: new Date().toISOString(),
            totalChunks: fileChunks.length,
          };

          const fileId = await saveFileMetadata(fileMetadata);

          // Encrypt and save each chunk with batch processing to prevent stack overflow
          for (
            let chunkIndex = 0;
            chunkIndex < fileChunks.length;
            chunkIndex++
          ) {
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
            setUploadProgress(
              Math.round((totalChunksProcessed / totalChunks) * 100)
            );

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

  const handlePreview = useCallback(
    async (file, setPreviewFile, setPreviewUrl, setIsLoading, setError) => {
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

        // Revoke previous preview URL before setting a new one
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
    },
    [encryptionKey]
  );

  const handleDelete = useCallback(
    async (fileId, setSuccess, setError, loadFiles) => {
      if (!window.confirm("Are you sure you want to delete this file?")) return;

      setError("");
      // setIsLoading(true); // We're not using setIsLoading here to avoid UI blocking

      try {
        await deleteFile(fileId);
        setSuccess("File deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
        await loadFiles();
      } catch (err) {
        console.error("Error deleting file:", err);
        setError("Failed to delete file");
      } finally {
        // setIsLoading(false);
      }
    },
    []
  );

  const handleExportFile = useCallback(
    async (file, setSuccess, setError, setIsLoading) => {
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
        // Reset input
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
}
