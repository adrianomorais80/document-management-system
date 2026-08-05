const { NotFoundError, ForbiddenError } = require('./errors');

function requireExistingDocument(document) {
  if (!document) {
    throw new NotFoundError('Documento não encontrado.');
  }
}

function requireDocumentOwnership(document, owner) {
  if (document.owner !== owner) {
    throw new ForbiddenError('Você não tem permissão para acessar este documento.');
  }
}

module.exports = {
  requireExistingDocument,
  requireDocumentOwnership,
};