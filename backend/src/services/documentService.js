const {
  requireOwner,
  requireUploadFile,
  requireDocumentId,
} = require('./documentValidation');
const {
  requireExistingDocument,
  requireDocumentOwnership,
} = require('./documentAccessPolicy');
const {
  createStoredDocument,
  toPublicMetadata,
} = require('./documentMetadataFactory');

class DocumentService {
  constructor(documentRepository) {
    this.documentRepository = documentRepository;
  }

  createDocument({ file, owner }) {
    requireOwner(owner);
    requireUploadFile(file);

    const storedDocument = createStoredDocument({ file, owner });
    const savedDocument = this.documentRepository.save(storedDocument);

    return toPublicMetadata(savedDocument);
  }

  listDocuments(owner) {
    requireOwner(owner);

    return this.documentRepository
      .findByOwner(owner)
      .map((document) => toPublicMetadata(document));
  }

  getDocumentForDownload({ id, owner }) {
    requireOwner(owner);
    requireDocumentId(id);

    const document = this.documentRepository.findById(id);
    requireExistingDocument(document);
    requireDocumentOwnership(document, owner);

    return document;
  }
}

module.exports = DocumentService;module.exports = require('./documents.service');