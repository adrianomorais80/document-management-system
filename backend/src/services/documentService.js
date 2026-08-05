const { randomUUID } = require('node:crypto');
const { ValidationError, NotFoundError, ForbiddenError } = require('./errors');

class DocumentService {
  constructor(documentRepository) {
    this.documentRepository = documentRepository;
  }

  createDocument({ file, owner }) {
    if (!owner) {
      throw new ValidationError('Header x-user-id é obrigatório.');
    }

    if (!file) {
      throw new ValidationError('Arquivo é obrigatório para upload.');
    }

    const document = {
      id: randomUUID(),
      originalName: file.originalname,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      owner,
      storedName: file.filename,
      storagePath: file.path,
      mimeType: file.mimetype,
    };

    this.documentRepository.save(document);
    return this.toPublicMetadata(document);
  }

  listDocuments(owner) {
    if (!owner) {
      throw new ValidationError('Header x-user-id é obrigatório.');
    }

    const documents = this.documentRepository.findByOwner(owner);
    return documents.map((document) => this.toPublicMetadata(document));
  }

  getDocumentForDownload({ id, owner }) {
    if (!owner) {
      throw new ValidationError('Header x-user-id é obrigatório.');
    }

    if (!id) {
      throw new ValidationError('Parâmetro id é obrigatório.');
    }

    const document = this.documentRepository.findById(id);

    if (!document) {
      throw new NotFoundError('Documento não encontrado.');
    }

    if (document.owner !== owner) {
      throw new ForbiddenError('Você não tem permissão para acessar este documento.');
    }

    return document;
  }

  toPublicMetadata(document) {
    return {
      id: document.id,
      originalName: document.originalName,
      size: document.size,
      uploadedAt: document.uploadedAt,
      owner: document.owner,
    };
  }
}

module.exports = DocumentService;