/**
 * Test Helper Utilities
 * These utilities help with E2E testing of Veltrain
 */

/**
 * Clear all test data
 */
export async function clearTestData() {
  // Clear localStorage
  localStorage.clear();
  
  // Clear IndexedDB
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.deleteDatabase('VeltrainDB');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all files from IndexedDB (for testing)
 */
export async function getTestFiles() {
  const dbName = 'VeltrainDB';
  
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
      getAllRequest.onerror = () => {
        reject(getAllRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Get all chunks from IndexedDB (for testing)
 */
export async function getTestChunks() {
  const dbName = 'VeltrainDB';
  
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['chunks'], 'readonly');
      const store = transaction.objectStore('chunks');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
      getAllRequest.onerror = () => {
        reject(getAllRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Check storage quota
 */
export async function getStorageInfo() {
  if (!navigator.storage || !navigator.storage.estimate) {
    return null;
  }
  
  return navigator.storage.estimate();
}

/**
 * Get session info
 */
export function getSessionInfo() {
  const session = localStorage.getItem('veltrain_session');
  return session ? JSON.parse(session) : null;
}

/**
 * Simulate file for testing
 */
export function createTestFile(name = 'test.txt', content = 'Test content', mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  blob.name = name;
  blob.lastModified = new Date().getTime();
  return blob;
}

/**
 * Test encryption/decryption round trip
 */
export async function testEncryptionRoundTrip(testContent) {
  try {
    const { deriveKey, encryptChunk, decryptChunk } = await import('./crypto.js');
    
    const passphrase = 'test-passphrase-123';
    const key = await deriveKey(passphrase);
    
    const data = new TextEncoder().encode(testContent);
    const { iv, ciphertext } = await encryptChunk(data, key);
    
    const decrypted = await decryptChunk(iv, ciphertext, key);
    const decryptedText = new TextDecoder().decode(decrypted);
    
    return decryptedText === testContent;
  } catch (error) {
    console.error('Encryption round trip test failed:', error);
    return false;
  }
}

/**
 * Log test status
 */
export function logTestStatus(testName, passed, details = '') {
  const status = passed ? '✓ PASS' : '✗ FAIL';
  const message = `${status}: ${testName}`;
  const logFn = passed ? console.log : console.error;
  
  logFn(message);
  if (details) logFn(`  ${details}`);
}

/**
 * Wait for condition (useful in tests)
 */
export async function waitFor(condition, timeout = 5000, interval = 100) {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    if (condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  return false;
}

/**
 * Run all basic tests
 */
export async function runBasicTests() {
  console.log('Running Veltrain basic tests...\n');
  
  const results = {};
  
  // Test 1: Encryption/Decryption
  try {
    results.encryption = await testEncryptionRoundTrip('Hello, Veltrain!');
    logTestStatus('Encryption Round Trip', results.encryption);
  } catch (error) {
    results.encryption = false;
    logTestStatus('Encryption Round Trip', false, error.message);
  }
  
  // Test 2: Storage
  try {
    await clearTestData();
    results.storage = true;
    logTestStatus('Storage Operations', true, 'Can clear and reinit IndexedDB');
  } catch (error) {
    results.storage = false;
    logTestStatus('Storage Operations', false, error.message);
  }
  
  // Test 3: Session
  try {
    localStorage.setItem('veltrain_session', JSON.stringify({ test: true }));
    const session = JSON.parse(localStorage.getItem('veltrain_session'));
    results.session = session.test === true;
    localStorage.clear();
    logTestStatus('Session Storage', results.session);
  } catch (error) {
    results.session = false;
    logTestStatus('Session Storage', false, error.message);
  }
  
  // Test 4: Storage Quota
  try {
    const storageInfo = await getStorageInfo();
    if (storageInfo) {
      results.quota = true;
      const usedMB = (storageInfo.usage / (1024 * 1024)).toFixed(2);
      const totalMB = (storageInfo.quota / (1024 * 1024)).toFixed(2);
      logTestStatus('Storage Quota', true, `${usedMB}MB / ${totalMB}MB used`);
    } else {
      results.quota = false;
      logTestStatus('Storage Quota', false, 'Storage API not available');
    }
  } catch (error) {
    results.quota = false;
    logTestStatus('Storage Quota', false, error.message);
  }
  
  // Summary
  console.log('\n--- Test Summary ---');
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  console.log(`Passed: ${passed}/${total}`);
  
  return results;
}

export default {
  clearTestData,
  getTestFiles,
  getTestChunks,
  getStorageInfo,
  getSessionInfo,
  createTestFile,
  testEncryptionRoundTrip,
  logTestStatus,
  waitFor,
  runBasicTests,
};
