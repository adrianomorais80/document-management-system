const { randomUUID } = require('node:crypto');

function createStoredDocument({ file, owner }) {
  return {
    id: randomUUID(),
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner,
    storedName: file.filename,
    storagePath: file.path,
    mimeType: file.mimetype,
  };
}

function toPublicMetadata(document) {
  return {
    id: document.id,
    originalName: document.originalName,
    size: document.size,
    uploadedAt: document.uploadedAt,
    owner: document.owner,
  };
}

module.exports = {
  createStoredDocument,
  toPublicMetadata,
};