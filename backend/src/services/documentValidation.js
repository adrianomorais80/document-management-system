const { ValidationError } = require('./errors');

function requireOwner(owner) {
  if (!owner) {
    throw new ValidationError('Header x-user-id é obrigatório.');
  }
}

function requireUploadFile(file) {
  if (!file) {
    throw new ValidationError('Arquivo é obrigatório para upload.');
  }
}

function requireDocumentId(id) {
  if (!id) {
    throw new ValidationError('Parâmetro id é obrigatório.');
  }
}

module.exports = {
  requireOwner,
  requireUploadFile,
  requireDocumentId,
};