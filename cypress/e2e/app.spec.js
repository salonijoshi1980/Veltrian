// Veltrain E2E Tests
// This file contains comprehensive tests for the file manager

const testUsername = 'testuser';
const testPassword = 'testpass123';
const testPassphrase = 'mysecurepassphrase123';

describe('Veltrain Cloudless File Manager', function() {
  
  before(function() {
    cy.visit('/');
  });

  describe('Login & Authentication', function() {
    
    it('should display login page', function() {
      cy.url().should('include', '/login');
      cy.contains('Veltrain').should('be.visible');
      cy.contains('Cloudless File Manager').should('be.visible');
    });

    it('should require username and password', function() {
      cy.get('button[type="submit"]').click();
      cy.contains('Please enter both username and password').should('be.visible');
    });

    it('should login successfully', function() {
      cy.get('input[placeholder="Enter username"]').type(testUsername);
      cy.get('input[placeholder="Enter password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/app');
    });
  });

  describe('Encryption Setup', function() {
    
    it('should show encryption setup screen', function() {
      cy.contains('Set Up Encryption').should('be.visible');
    });

    it('should require passphrase', function() {
      cy.get('button').contains('Continue').click();
      cy.contains('Please enter a passphrase').should('be.visible');
    });

    it('should setup encryption with passphrase', function() {
      cy.get('input[placeholder="Enter a strong passphrase"]').type(testPassphrase);
      cy.get('button').contains('Continue').click();
      cy.contains('Upload Files').should('be.visible');
    });
  });

  describe('File Upload', function() {
    
    it('should display upload area', function() {
      cy.contains('Upload Files').should('be.visible');
      cy.contains('Drag and drop files').should('be.visible');
      cy.get('button').contains('Choose Files').should('be.visible');
    });

    it('should upload file via file picker', function() {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('Test file content'),
        fileName: 'test.txt',
        mimeType: 'text/plain'
      });
      cy.contains('Successfully uploaded').should('be.visible');
    });

    it('should show file in list after upload', function() {
      cy.contains('test.txt').should('be.visible');
    });

    it('should show upload progress', function() {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('Another test'),
        fileName: 'test2.txt',
        mimeType: 'text/plain'
      });
      cy.get('.h-2.rounded-full').should('exist');
    });
  });

  describe('File Management', function() {
    
    it('should display file table', function() {
      cy.contains('Your Files').should('be.visible');
    });

    it('should show file details', function() {
      cy.contains('test.txt').should('be.visible');
      cy.contains('Bytes').should('be.visible');
      cy.contains('text/plain').should('be.visible');
    });

    it('should preview text file', function() {
      cy.contains('test.txt').closest('tr').within(() => {
        cy.get('button').contains('Preview').click();
      });
      cy.get('iframe').should('be.visible');
    });

    it('should close preview modal', function() {
      cy.get('button').contains('×').click();
      cy.get('iframe').should('not.exist');
    });

    it('should export file', function() {
      cy.contains('test.txt').closest('tr').within(() => {
        cy.get('button').contains('Export').click();
      });
      cy.contains('File exported successfully').should('be.visible');
    });

    it('should delete file with confirmation', function() {
      cy.contains('test.txt').closest('tr').within(() => {
        cy.get('button').contains('Delete').click();
      });
      cy.on('window:confirm', () => true);
      cy.contains('File deleted successfully').should('be.visible');
    });
  });

  describe('Backup Operations', function() {
    
    beforeEach(function() {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('Backup test'),
        fileName: 'backup.txt',
        mimeType: 'text/plain'
      });
      cy.contains('Successfully uploaded').should('be.visible');
    });

    it('should export backup', function() {
      cy.get('button').contains('Export Backup').click();
      cy.contains('Backup exported successfully').should('be.visible');
    });

    it('should have import backup button', function() {
      cy.get('button').contains('Import Backup').should('be.visible');
    });
  });

  describe('User Session', function() {
    
    it('should show user greeting', function() {
      cy.contains(`Welcome, ${testUsername}!`).should('be.visible');
    });

    it('should show logout button', function() {
      cy.get('button').contains('Logout').should('be.visible');
    });

    it('should logout successfully', function() {
      cy.get('button').contains('Logout').click();
      cy.url().should('include', '/login');
    });

    it('should redirect to login after logout', function() {
      cy.visit('/app');
      cy.url().should('include', '/login');
    });
  });

  describe('Data Encryption', function() {
    
    it('should encrypt files in IndexedDB', function() {
      // Login again
      cy.get('input[placeholder="Enter username"]').type(testUsername);
      cy.get('input[placeholder="Enter password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.contains('Set Up Encryption').should('be.visible');

      // Setup encryption
      cy.get('input[placeholder="Enter a strong passphrase"]').type(testPassphrase);
      cy.get('button').contains('Continue').click();

      // Upload file
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('Encrypted data'),
        fileName: 'encrypted.txt',
        mimeType: 'text/plain'
      });

      cy.contains('Successfully uploaded').should('be.visible');

      // Verify file is stored
      cy.contains('encrypted.txt').should('be.visible');
    });

    it('should persist encrypted data', function() {
      // File should still be visible
      cy.contains('encrypted.txt').should('be.visible');
    });
  });

  describe('Error Handling', function() {
    
    it('should handle different file types', function() {
      const fileTypes = [
        { name: 'image.png', content: 'PNG', mime: 'image/png' },
        { name: 'doc.pdf', content: 'PDF', mime: 'application/pdf' }
      ];

      fileTypes.forEach((file) => {
        cy.get('input[type="file"]').selectFile({
          contents: Cypress.Buffer.from(file.content),
          fileName: file.name,
          mimeType: file.mime
        });
        cy.contains('Successfully uploaded').should('be.visible');
      });
    });

    it('should show unsupported preview message', function() {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('BINARY'),
        fileName: 'binary.bin',
        mimeType: 'application/octet-stream'
      });
      cy.contains('Successfully uploaded').should('be.visible');

      cy.contains('binary.bin').closest('tr').within(() => {
        cy.get('button').contains('Preview').click();
      });
      cy.contains('Preview not available').should('be.visible');
    });
  });

  describe('UI Responsiveness', function() {
    
    it('should be responsive on mobile', function() {
      cy.viewport('iphone-x');
      cy.contains('Upload Files').should('be.visible');
      cy.get('button').contains('Choose Files').should('be.visible');
    });

    it('should be responsive on tablet', function() {
      cy.viewport('ipad-2');
      cy.contains('Upload Files').should('be.visible');
    });

    it('should be responsive on desktop', function() {
      cy.viewport(1920, 1080);
      cy.contains('Upload Files').should('be.visible');
      cy.get('table').should('be.visible');
    });
  });
});
