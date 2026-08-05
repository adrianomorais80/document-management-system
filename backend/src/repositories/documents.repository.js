class DocumentsRepository {
  constructor() {
    this.documents = [];
  }

  save(document) {
    this.documents.push(document);
    return document;
  }

  findByOwner(owner) {
    return this.documents.filter((document) => document.owner === owner);
  }

  findById(id) {
    return this.documents.find((document) => document.id === id) || null;
  }

  clearAll() {
    this.documents = [];
  }
}

module.exports = new DocumentsRepository();