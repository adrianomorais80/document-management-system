const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const multer = require('multer');
const documentsRepository = require('../repositories/documents.repository');
const DocumentsService = require('../services/documents.service');
const DocumentsController = require('../controllers/documents.controller');

const router = express.Router();

const storageDirectory = path.resolve(__dirname, '../../storage');
fs.mkdirSync(storageDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDirectory);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${timestamp}-${sanitizedName}`);
  },
});

const maxFileSizeBytes = Number(process.env.MAX_FILE_SIZE_BYTES || 10 * 1024 * 1024);

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSizeBytes,
  },
});

const documentsService = new DocumentsService(documentsRepository);
const documentsController = new DocumentsController(documentsService);

router.post('/upload', upload.single('file'), documentsController.upload);
router.get('/documents', documentsController.list);
router.get('/documents/:id/download', documentsController.download);

module.exports = router;