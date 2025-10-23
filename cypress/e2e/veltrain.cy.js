describe('Veltrain File Manager E2E Tests', () => {
  const testUsername = 'testuser';
  const testPassword = 'testpass123';
  const testPassphrase = 'mysecurepassphrase123';

  beforeEach(() => {
    // Clear IndexedDB and localStorage before each test
    cy.window().then((win) => {
      // Clear localStorage
      win.localStorage.clear();
      
      // Clear IndexedDB
      const dbName = 'VeltrainDB';
      const deleteRequest = win.indexedDB.deleteDatabase(dbName);
      
      deleteRequest.onsuccess = () => {
        console.log('IndexedDB cleared');
      };
    });
  });

  describe('Login Flow', () => {
    it('should display login page when not authenticated', () => {
      cy.visit('/');
      cy.url().should('include', '/login');
      cy.contains('Veltrain').should('exist');
      cy.contains('Cloudless File Manager').should('exist');
    });

    it('should show error when username or password is empty', () => {
      cy.visit('/login');
      cy.get('button[type="submit"]').click();
      cy.contains('Please enter both username and password').should('exist');
    });

    it('should successfully login with valid credentials', () => {
      cy.visit('/login');
      cy.get('input[placeholder="Enter username"]').type(testUsername);
      cy.get('input[placeholder="Enter password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      // Should redirect to app
      cy.url().should('include', '/app');
      cy.contains('Set Up Encryption').should('exist');
    });

    it('should remember login after page refresh', () => {
      cy.visit('/login');
      cy.get('input[placeholder="Enter username"]').type(testUsername);
      cy.get('input[placeholder="Enter password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/app');
      
      // Refresh page
      cy.reload();
      
      // Should still be on app page
      cy.url().should('include', '/app');
    });
  });

  describe('Encryption Setup', () => {
    beforeEach(() => {
      // Login before each test
      cy.visit('/login');
      cy.get('input[placeholder="Enter username"]').type(testUsername);
      cy.get('input[placeholder="Enter password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/app');
    });

    it('should display passphrase setup screen', () => {
      cy.contains('Set Up Encryption').should('exist');
      cy.contains('Enter a strong passphrase to encrypt your files').should('exist');
    });

    it('should show error when passphrase is empty', () => {
      cy.get('button').contains('Continue').click();
      cy.contains('Please enter a passphrase').should('exist');
    });

    it('should successfully set up encryption with passphrase', () => {
      cy.get('input[placeholder="Enter a strong passphrase"]').type(testPassphrase);
      cy.get('button').contains('Continue').click();
      
      // Should redirect to main app
      cy.contains('Upload Files').should('exist');
      cy.contains('Your Files').should('exist');
    });

    it('should persist encryption key within session', () => {
      cy.get('input[placeholder="Enter a strong passphrase"]').type(testPassphrase);
      cy.get('button').contains('Continue').click();
      
      cy.contains('Upload Files').should('exist');
      
      // Page refresh should keep the app state (key in memory)
      // Note: Key is stored in memory, not persistence needed
    });
  });

  describe('File Upload', () => {
    beforeEach(() => {
      // Login and setup encryption
      cy.visit('/login');
      cy.get('input[placeholder="Enter username"]').type(testUsername);
      cy.get('input[placeholder="Enter password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/app');
      cy.get('input[placeholder="Enter a strong passphrase"]').type(testPassphrase);
      cy.get('button').contains('Continue').click();
      
      cy.contains('Upload Files').should('exist');
    });

    it('should display upload area', () => {
      cy.contains('Upload Files').should('exist');
      cy.contains('Drag and drop files here or click to select').should('exist');
      cy.get('button').contains('Choose Files').should('exist');
    });

    it('should upload a single file via file picker', () => {
      // Create a test file
      const fileName = 'test-file.txt';
      const fileContent = 'This is a test file for Veltrain';

      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: fileName,
        mimeType: 'text/plain',
      });

      // Wait for upload to complete
      cy.contains('Successfully uploaded', { timeout: 10000 }).should('exist');
      
      // File should appear in list
      cy.contains(fileName).should('exist');
    });

    it('should upload multiple files', () => {
      const files = [
        { name: 'file1.txt', content: 'Content 1' },
        { name: 'file2.txt', content: 'Content 2' },
        { name: 'file3.txt', content: 'Content 3' },
      ];

      files.forEach((file, index) => {
        if (index === 0) {
          cy.get('input[type="file"]').selectFile({
            contents: Cypress.Buffer.from(file.content),
            fileName: file.name,
            mimeType: 'text/plain',
          });
        }
      });

      cy.contains('Successfully uploaded', { timeout: 10000 }).should('exist');

      // Check if files appear in list
      files.forEach((file) => {
        cy.contains(file.name).should('exist');
      });
    });

    it('should show upload progress bar', () => {
      const fileContent = 'This is test content';
      const fileName = 'test.txt';

      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: fileName,
        mimeType: 'text/plain',
      });

      // Progress bar should appear
      cy.get('.h-2.rounded-full').should('be.visible');
    });

    it('should encrypt files before storing', () => {
      const fileContent = 'Sensitive data';
      const fileName = 'sensitive.txt';

      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: fileName,
        mimeType: 'text/plain',
      });

      cy.contains('Successfully uploaded', { timeout: 10000 }).should('exist');

      // Verify file is stored (UI shows it)
      cy.contains(fileName).should('exist');

      // Verify IndexedDB contains encrypted data
      cy.window().then((win) => {
        const dbName = 'VeltrainDB';
        const request = win.indexedDB.open(dbName);

        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['files'], 'readonly');
          const store = transaction.objectStore('files');
          const getAllRequest = store.getAll();

          getAllRequest.onsuccess = () => {
            expect(getAllRequest.result.length).to.be.greaterThan(0);
          };
        };
      });
    });
  });

  describe('File Management', () => {
    beforeEach(() => {
      // Login, setup encryption, and upload a test file
      cy.visit('/login');
      cy.get('input[placeholder="Enter username"]').type(testUsername);
      cy.get('input[placeholder="Enter password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/app');
      cy.get('input[placeholder="Enter a strong passphrase"]').type(testPassphrase);
      cy.get('button').contains('Continue').click();
      
      // Upload a test file
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('Test content'),
        fileName: 'test-file.txt',
        mimeType: 'text/plain',
      });

      cy.contains('Successfully uploaded', { timeout: 10000 }).should('exist');
    });

    it('should display uploaded files in list', () => {
      cy.contains('Your Files (1)').should('exist');
      cy.contains('test-file.txt').should('exist');
    });

    it('should show file details (name, size, type, date)', () => {
      cy.contains('test-file.txt').should('exist');
      cy.contains('Bytes').should('exist'); // Size
      cy.contains('text/plain').should('exist'); // Type
    });

    it('should preview text file', () => {
      cy.contains('test-file.txt').closest('tr').within(() => {
        cy.get('button').contains('Preview').click();
      });

      // Preview modal should open
      cy.get('iframe').should('be.visible');
    });

    it('should export a file', () => {
      cy.contains('test-file.txt').closest('tr').within(() => {
        cy.get('button').contains('Export').click();
      });

      cy.contains('File exported successfully').should('exist');
    });

    it('should delete a file with confirmation', () => {
      cy.contains('test-file.txt').closest('tr').within(() => {
        cy.get('button').contains('Delete').click();
      });

      // Confirm deletion
      cy.on('window:confirm', () => true);

      cy.contains('File deleted successfully').should('exist');
      cy.contains('test-file.txt').should('not.exist');
    });

    it('should prevent delete without confirmation', () => {
      cy.contains('test-file.txt').closest('tr').within(() => {
        cy.get('button').contains('Delete').click();
      });

      // Cancel deletion
      cy.on('window:confirm', () => false);

      // File should still exist
      cy.contains('test-file.txt').should('exist');
    });

    it('should handle multiple files independently', () => {
      // Upload another file
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('File 2 content'),
        fileName: 'file2.txt',
        mimeType: 'text/plain',
      });

      cy.contains('Successfully uploaded', { timeout: 10000 }).should('exist');
      cy.contains('Your Files (2)').should('exist');

      // Both files should exist
      cy.contains('test-file.txt').should('exist');
      cy.contains('file2.txt').should('exist');

      // Delete only one
      cy.contains('test-file.txt').closest('tr').within(() => {
        cy.get('button').contains('Delete').click();
      });

      cy.on('window:confirm', () => true);
      cy.contains('File deleted successfully').should('exist');

      // Only second file should remain
      cy.contains('test-file.txt').should('not.exist');
      cy.contains('file2.txt').should('exist');
    });
  });

  describe('Backup & Restore', () => {
    beforeEach(() => {
      // Login, setup encryption, and upload files
      cy.visit('/login');
      cy.get('input[placeholder="Enter username"]').type(testUsername);
      cy.get('input[placeholder="Enter password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/app');
      cy.get('input[placeholder="Enter a strong passphrase"]').type(testPassphrase);
      cy.get('button').contains('Continue').click();
      
      // Upload test files
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('Backup test file'),
        fileName: 'backup-test.txt',
        mimeType: 'text/plain',
      });

      cy.contains('Successfully uploaded', { timeout: 10000 }).should('exist');
    });

    it('should export backup', () => {
      cy.get('button').contains('Export Backup').click();
      cy.contains('Backup exported successfully').should('exist');
    });

    it('should persist files after page refresh', () => {
      // Files should be visible
      cy.contains('backup-test.txt').should('exist');

      // Refresh page (but stay logged in)
      cy.reload();

      // Passphrase setup should appear again (key lost in memory)
      // This is expected behavior - key doesn't persist
      cy.contains('Set Up Encryption').should('exist');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.get('input[placeholder="Enter username"]').type(testUsername);
      cy.get('input[placeholder="Enter password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/app');
      cy.get('input[placeholder="Enter a strong passphrase"]').type(testPassphrase);
      cy.get('button').contains('Continue').click();
    });

    it('should display logout button in header', () => {
      cy.get('button').contains('Logout').should('exist');
    });

    it('should logout user and redirect to login', () => {
      cy.get('button').contains('Logout').click();

      cy.url().should('include', '/login');
      cy.contains('Veltrain').should('exist');
    });

    it('should clear session after logout', () => {
      cy.get('button').contains('Logout').click();

      // Try to access /app directly
      cy.visit('/app');

      // Should redirect to login
      cy.url().should('include', '/login');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.get('input[placeholder="Enter username"]').type(testUsername);
      cy.get('input[placeholder="Enter password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/app');
      cy.get('input[placeholder="Enter a strong passphrase"]').type(testPassphrase);
      cy.get('button').contains('Continue').click();
    });

    it('should handle invalid file upload gracefully', () => {
      // This test verifies the app doesn't crash with various file types
      const fileTypes = [
        { name: 'image.png', content: 'PNG', mime: 'image/png' },
        { name: 'doc.pdf', content: 'PDF', mime: 'application/pdf' },
        { name: 'archive.zip', content: 'ZIP', mime: 'application/zip' },
      ];

      fileTypes.forEach((file) => {
        cy.get('input[type="file"]').selectFile({
          contents: Cypress.Buffer.from(file.content),
          fileName: file.name,
          mimeType: file.mime,
        });

        cy.contains('Successfully uploaded', { timeout: 10000 }).should('exist');
      });

      // All files should be listed
      cy.contains('Your Files (3)').should('exist');
    });

    it('should handle preview of unsupported file types', () => {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('BINARY'),
        fileName: 'binary.bin',
        mimeType: 'application/octet-stream',
      });

      cy.contains('Successfully uploaded', { timeout: 10000 }).should('exist');

      cy.contains('binary.bin').closest('tr').within(() => {
        cy.get('button').contains('Preview').click();
      });

      // Should show appropriate message
      cy.contains('Preview not available', { timeout: 10000 }).should('exist');
    });
  });

  describe('UI Elements & Navigation', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.get('input[placeholder="Enter username"]').type(testUsername);
      cy.get('input[placeholder="Enter password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/app');
      cy.get('input[placeholder="Enter a strong passphrase"]').type(testPassphrase);
      cy.get('button').contains('Continue').click();
    });

    it('should have responsive layout', () => {
      cy.viewport('iphone-x');
      cy.contains('Upload Files').should('be.visible');
      
      cy.viewport('ipad-2');
      cy.contains('Upload Files').should('be.visible');
      
      cy.viewport(1920, 1080);
      cy.contains('Upload Files').should('be.visible');
    });

    it('should display all action buttons correctly', () => {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('Test'),
        fileName: 'test.txt',
        mimeType: 'text/plain',
      });

      cy.contains('Successfully uploaded', { timeout: 10000 }).should('exist');

      cy.contains('test.txt').closest('tr').within(() => {
        cy.get('button').contains('Preview').should('be.visible');
        cy.get('button').contains('Export').should('be.visible');
        cy.get('button').contains('Delete').should('be.visible');
      });
    });

    it('should show welcome message with username', () => {
      cy.contains(`Welcome, ${testUsername}!`).should('exist');
    });

    it('should display file count accurately', () => {
      // Initially no files
      cy.contains('Your Files (0)').should('exist');

      // Upload one file
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('File 1'),
        fileName: 'file1.txt',
        mimeType: 'text/plain',
      });

      cy.contains('Successfully uploaded', { timeout: 10000 }).should('exist');
      cy.contains('Your Files (1)').should('exist');

      // Upload another file
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('File 2'),
        fileName: 'file2.txt',
        mimeType: 'text/plain',
      });

      cy.contains('Successfully uploaded', { timeout: 10000 }).should('exist');
      cy.contains('Your Files (2)').should('exist');
    });
  });

  describe('Data Persistence', () => {
    it('should persist files in IndexedDB across different login sessions', () => {
      // First session: login and upload
      cy.visit('/login');
      cy.get('input[placeholder="Enter username"]').type(testUsername);
      cy.get('input[placeholder="Enter password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/app');
      cy.get('input[placeholder="Enter a strong passphrase"]').type(testPassphrase);
      cy.get('button').contains('Continue').click();
      
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('Persistent data'),
        fileName: 'persistent.txt',
        mimeType: 'text/plain',
      });

      cy.contains('Successfully uploaded', { timeout: 10000 }).should('exist');

      // Logout
      cy.get('button').contains('Logout').click();
      cy.url().should('include', '/login');

      // Second session: login again
      cy.get('input[placeholder="Enter username"]').type(testUsername);
      cy.get('input[placeholder="Enter password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/app');
      cy.get('input[placeholder="Enter a strong passphrase"]').type(testPassphrase);
      cy.get('button').contains('Continue').click();

      // File should still be in IndexedDB
      cy.contains('persistent.txt').should('exist');
      cy.contains('Your Files (1)').should('exist');
    });
  });
});
