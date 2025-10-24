// Efficient backup utilities

/**
 * Convert binary data to base64 for efficient JSON storage
 * @param {Uint8Array} data - Binary data
 * @returns {string} - Base64 encoded string
 */
function toBase64(data) {
  try {
    // Use a more efficient approach for large arrays to avoid stack overflow
    let binary = "";
    const len = data.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(data[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error("Error converting to base64:", error);
    throw error;
  }
}

/**
 * Convert base64 string back to binary data
 * @param {string} base64 - Base64 encoded string
 * @returns {Uint8Array} - Binary data
 */
function fromBase64(base64) {
  try {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error("Error converting from base64:", error);
    throw error;
  }
}

/**
 * Optimize chunks for backup by converting binary data to base64
 * @param {Array} chunks - Raw chunks with binary data as arrays
 * @returns {Array} - Optimized chunks with base64 encoded data
 */
function optimizeChunksForBackup(chunks) {
  try {
    return chunks.map((chunk) => {
      // Handle case where iv and ciphertext might already be strings
      if (
        typeof chunk.iv === "string" &&
        typeof chunk.ciphertext === "string"
      ) {
        return chunk; // Already optimized
      }

      // Convert arrays to base64 strings
      let ivBase64 = chunk.iv;
      let cipherBase64 = chunk.ciphertext;

      if (Array.isArray(chunk.iv)) {
        // Convert array to binary string then to base64
        let binary = "";
        for (let i = 0; i < chunk.iv.length; i++) {
          binary += String.fromCharCode(chunk.iv[i]);
        }
        ivBase64 = btoa(binary);
      }

      if (Array.isArray(chunk.ciphertext)) {
        // Convert array to binary string then to base64
        let binary = "";
        for (let i = 0; i < chunk.ciphertext.length; i++) {
          binary += String.fromCharCode(chunk.ciphertext[i]);
        }
        cipherBase64 = btoa(binary);
      }

      return {
        ...chunk,
        iv: ivBase64,
        ciphertext: cipherBase64,
      };
    });
  } catch (error) {
    console.error("Error optimizing chunks for backup:", error);
    throw error;
  }
}

/**
 * Restore chunks from backup by converting base64 back to binary arrays
 * @param {Array} chunks - Optimized chunks with base64 encoded data
 * @returns {Array} - Restored chunks with binary data as arrays
 */
function restoreChunksFromBackup(chunks) {
  try {
    return chunks.map((chunk) => {
      // Handle case where iv and ciphertext might already be arrays
      if (Array.isArray(chunk.iv) && Array.isArray(chunk.ciphertext)) {
        return chunk; // Already restored
      }

      // Convert base64 strings to arrays
      let ivArray = chunk.iv;
      let cipherArray = chunk.ciphertext;

      if (typeof chunk.iv === "string") {
        // Convert base64 string to binary string then to array
        const binaryString = atob(chunk.iv);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        ivArray = Array.from(bytes);
      }

      if (typeof chunk.ciphertext === "string") {
        // Convert base64 string to binary string then to array
        const binaryString = atob(chunk.ciphertext);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        cipherArray = Array.from(bytes);
      }

      return {
        ...chunk,
        iv: ivArray,
        ciphertext: cipherArray,
      };
    });
  } catch (error) {
    console.error("Error restoring chunks from backup:", error);
    throw error;
  }
}

/**
 * Create an efficient binary backup
 * @param {Array} files - File metadata
 * @param {Array} chunks - Encrypted chunks
 * @returns {Promise<Blob>} - Compact backup blob
 */
export async function createEfficientBackup(files, chunks) {
  try {
    // Optimize chunks for more efficient storage
    const optimizedChunks = optimizeChunksForBackup(chunks);

    // Create a more compact representation
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      files: files,
      chunks: optimizedChunks,
    };

    // Use compact JSON (no indentation) for smaller size
    const jsonString = JSON.stringify(backupData);
    return new Blob([jsonString], { type: "application/json" });
  } catch (error) {
    console.error("Error creating efficient backup:", error);
    throw error;
  }
}

/**
 * Parse backup data from blob
 * @param {Blob} backupBlob - Backup blob
 * @returns {Promise<Object>} - Parsed backup data with restored chunks
 */
export async function parseBackup(backupBlob) {
  try {
    const text = await backupBlob.text();
    const backupData = JSON.parse(text);

    // Restore chunks from optimized format
    if (backupData.chunks) {
      backupData.chunks = restoreChunksFromBackup(backupData.chunks);
    }

    return backupData;
  } catch (error) {
    console.error("Error parsing backup:", error);
    throw error;
  }
}
