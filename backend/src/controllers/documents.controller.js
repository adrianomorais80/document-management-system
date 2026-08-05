class DocumentsController {
  constructor(documentsService) {
    this.documentsService = documentsService;

    this.upload = this.upload.bind(this);
    this.list = this.list.bind(this);
    this.download = this.download.bind(this);
  }

  upload(req, res, next) {
    try {
      const owner = req.header('x-user-id');
      const metadata = this.documentsService.createDocument({
        file: req.file,
        owner,
      });

      return res.status(201).json(metadata);
    } catch (error) {
      return next(error);
    }
  }

  list(req, res, next) {
    try {
      const owner = req.header('x-user-id');
      const documents = this.documentsService.listDocuments(owner);
      return res.status(200).json(documents);
    } catch (error) {
      return next(error);
    }
  }

  download(req, res, next) {
    try {
      const owner = req.header('x-user-id');
      const { id } = req.params;
      const document = this.documentsService.getDocumentForDownload({ id, owner });

      res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
      return res.download(document.storagePath, document.originalName);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = DocumentsController;