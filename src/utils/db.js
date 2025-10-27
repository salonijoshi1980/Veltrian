// IndexedDB Storage Layer
import { createEfficientBackup, parseBackup } from "./backup.js";

const DB_NAME = "VeltrainDB";
const DB_VERSION = 1;
const STORE_FILES = "files";
const STORE_CHUNKS = "chunks";

/**
 * Initialize IndexedDB
 * @returns {Promise<IDBDatabase>}
 */
export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("IndexedDB error:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create files store
      if (!db.objectStoreNames.contains(STORE_FILES)) {
        const fileStore = db.createObjectStore(STORE_FILES, {
          keyPath: "id",
          autoIncrement: true,
        });
        fileStore.createIndex("name", "name", { unique: false });
        fileStore.createIndex("createdAt", "createdAt", { unique: false });
      }

      // Create chunks store
      if (!db.objectStoreNames.contains(STORE_CHUNKS)) {
        const chunkStore = db.createObjectStore(STORE_CHUNKS, {
          keyPath: "id",
          autoIncrement: true,
        });
        chunkStore.createIndex("fileId", "fileId", { unique: false });
        chunkStore.createIndex("chunkIndex", ["fileId", "chunkIndex"], {
          unique: true,
        });
      }
    };
  });
}

/**
 * Save file metadata to IndexedDB
 * @param {Object} fileMetadata - File metadata object
 * @returns {Promise<number>} - The file ID
 */
export async function saveFileMetadata(fileMetadata) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_FILES], "readwrite");
    const store = transaction.objectStore(STORE_FILES);
    const request = store.add(fileMetadata);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Update file metadata in IndexedDB
 * @param {Object} fileMetadata - File metadata object with id
 * @returns {Promise<number>} - The file ID
 */
export async function updateFileMetadata(fileMetadata) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_FILES], "readwrite");
    const store = transaction.objectStore(STORE_FILES);
    const request = store.put(fileMetadata);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save encrypted chunk to IndexedDB
 * @param {Object} chunkData - Chunk data object
 * @returns {Promise<number>} - The chunk ID
 */
export async function saveChunk(chunkData) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_CHUNKS], "readwrite");
    const store = transaction.objectStore(STORE_CHUNKS);
    // Use put() instead of add() to update existing chunks
    const request = store.put(chunkData);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all files metadata
 * @returns {Promise<Array>} - Array of file metadata objects
 */
export async function getAllFiles() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_FILES], "readonly");
    const store = transaction.objectStore(STORE_FILES);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get file metadata by ID
 * @param {number} fileId - The file ID
 * @returns {Promise<Object|undefined>} - File metadata or undefined
 */
export async function getFileMetadata(fileId) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_FILES], "readonly");
    const store = transaction.objectStore(STORE_FILES);
    const request = store.get(fileId);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all chunks for a file
 * @param {number} fileId - The file ID
 * @returns {Promise<Array>} - Array of chunks
 */
export async function getFileChunks(fileId) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_CHUNKS], "readonly");
    const store = transaction.objectStore(STORE_CHUNKS);
    const index = store.index("fileId");
    const request = index.getAll(fileId);

    request.onsuccess = () => {
      // Sort chunks by chunkIndex
      const chunks = request.result.sort((a, b) => a.chunkIndex - b.chunkIndex);
      resolve(chunks);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete file and its chunks
 * @param {number} fileId - The file ID
 * @returns {Promise<void>}
 */
export async function deleteFile(fileId) {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [STORE_FILES, STORE_CHUNKS],
      "readwrite"
    );

    // Delete file metadata
    const fileStore = transaction.objectStore(STORE_FILES);
    fileStore.delete(fileId);

    // Delete all chunks for this file
    const chunkStore = transaction.objectStore(STORE_CHUNKS);
    const index = chunkStore.index("fileId");
    const chunkRequest = index.openCursor(fileId);

    chunkRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Clear all data from IndexedDB
 * @returns {Promise<void>}
 */
export async function clearAllData() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [STORE_FILES, STORE_CHUNKS],
      "readwrite"
    );

    transaction.objectStore(STORE_FILES).clear();
    transaction.objectStore(STORE_CHUNKS).clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Export all data for backup (optimized format)
 * @returns {Promise<Blob>} - Backup data as efficient blob
 */
export async function exportBackupData() {
  try {
    const files = await getAllFiles();
    const db = await initDB();

    const allChunks = await new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_CHUNKS], "readonly");
      const store = transaction.objectStore(STORE_CHUNKS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    // Create efficient backup
    return await createEfficientBackup(files, allChunks);
  } catch (error) {
    console.error("Error exporting backup data:", error);
    throw error;
  }
}

/**
 * Import backup data
 * @param {Blob} backupBlob - The backup data blob
 * @returns {Promise<void>}
 */
export async function importBackupData(backupBlob) {
  const db = await initDB();

  try {
    // Parse backup data
    const backupData = await parseBackup(backupBlob);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        [STORE_FILES, STORE_CHUNKS],
        "readwrite"
      );

      const fileStore = transaction.objectStore(STORE_FILES);
      const chunkStore = transaction.objectStore(STORE_CHUNKS);

      // Import files
      backupData.files?.forEach((file) => {
        fileStore.add(file);
      });

      // Import chunks
      backupData.chunks?.forEach((chunk) => {
        chunkStore.add(chunk);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Error importing backup:", error);
    throw error;
  }
}
