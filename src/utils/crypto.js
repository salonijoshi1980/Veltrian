// Web Crypto API Encryption/Decryption Utilities

const ALGORITHM = {
  name: "AES-GCM",
  length: 256,
};

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunks (back to original size)

/**
 * Derive encryption key from passphrase
 * @param {string} passphrase - User's encryption passphrase
 * @returns {Promise<CryptoKey>} - The derived encryption key
 */
export async function deriveKey(passphrase) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(passphrase);

    // Use PBKDF2 to derive a key
    const importedKey = await window.crypto.subtle.importKey(
      "raw",
      data,
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("veltrain-salt"), // Static salt for consistency
        iterations: 100000,
        hash: "SHA-256",
      },
      importedKey,
      ALGORITHM,
      true,
      ["encrypt", "decrypt"]
    );

    return key;
  } catch (error) {
    console.error("Error deriving key:", error);
    throw error;
  }
}

/**
 * Encrypt a chunk of data
 * @param {Uint8Array} chunk - The data chunk to encrypt
 * @param {CryptoKey} key - The encryption key
 * @returns {Promise<{iv: string, ciphertext: string}>}
 */
export async function encryptChunk(chunk, key) {
  try {
    // Generate random IV (Initialization Vector)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const ciphertext = await window.crypto.subtle.encrypt(
      { ...ALGORITHM, iv },
      key,
      chunk
    );

    // Convert to base64 for efficient storage using a stack-safe approach
    let binary = "";
    const ivBytes = new Uint8Array(iv);
    for (let i = 0; i < ivBytes.byteLength; i++) {
      binary += String.fromCharCode(ivBytes[i]);
    }
    const ivBase64 = btoa(binary);

    binary = "";
    const cipherBytes = new Uint8Array(ciphertext);
    for (let i = 0; i < cipherBytes.byteLength; i++) {
      binary += String.fromCharCode(cipherBytes[i]);
    }
    const cipherBase64 = btoa(binary);

    return {
      iv: ivBase64,
      ciphertext: cipherBase64,
    };
  } catch (error) {
    console.error("Error encrypting chunk:", error);
    throw error;
  }
}

/**
 * Decrypt a chunk of data
 * @param {string} iv - The initialization vector (base64)
 * @param {string} ciphertext - The encrypted data (base64)
 * @param {CryptoKey} key - The decryption key
 * @returns {Promise<Uint8Array>} - The decrypted data
 */
export async function decryptChunk(iv, ciphertext, key) {
  try {
    // Convert base64 back to binary data using a stack-safe approach
    const ivBinaryString = atob(iv);
    const ivLen = ivBinaryString.length;
    const ivBytes = new Uint8Array(ivLen);
    for (let i = 0; i < ivLen; i++) {
      ivBytes[i] = ivBinaryString.charCodeAt(i);
    }

    const cipherBinaryString = atob(ciphertext);
    const cipherLen = cipherBinaryString.length;
    const cipherBytes = new Uint8Array(cipherLen);
    for (let i = 0; i < cipherLen; i++) {
      cipherBytes[i] = cipherBinaryString.charCodeAt(i);
    }

    const decrypted = await window.crypto.subtle.decrypt(
      {
        ...ALGORITHM,
        iv: ivBytes,
      },
      key,
      cipherBytes
    );

    return new Uint8Array(decrypted);
  } catch (error) {
    console.error("Error decrypting chunk:", error);
    throw error;
  }
}

/**
 * Split a Blob into chunks
 * @param {Blob} file - The file to chunk
 * @returns {Promise<Uint8Array[]>} - Array of chunks
 */
export async function chunkFile(file) {
  const chunks = [];
  let offset = 0;

  while (offset < file.size) {
    const slice = file.slice(offset, offset + CHUNK_SIZE);
    const arrayBuffer = await slice.arrayBuffer();
    chunks.push(new Uint8Array(arrayBuffer));
    offset += CHUNK_SIZE;
  }

  return chunks;
}

/**
 * Reconstruct a file from decrypted chunks
 * @param {Uint8Array[]} chunks - Array of decrypted chunks
 * @param {string} mimeType - MIME type of the file
 * @returns {Blob} - Reconstructed file
 */
export function reconstructFile(chunks, mimeType) {
  return new Blob(chunks, { type: mimeType });
}
