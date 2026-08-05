const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const app = require('../src/app');
const documentRepository = require('../src/repositories/documentRepository');

let server;
let baseUrl;

const storageDirectory = path.resolve(__dirname, '../storage');

function cleanStorageDirectory() {
  if (!fs.existsSync(storageDirectory)) {
    return;
  }

  for (const entry of fs.readdirSync(storageDirectory)) {
    const entryPath = path.join(storageDirectory, entry);
    if (fs.statSync(entryPath).isFile()) {
      fs.unlinkSync(entryPath);
    }
  }
}

async function uploadDocument({ owner = 'user-1', content = 'arquivo de teste' } = {}) {
  const formData = new FormData();
  formData.append('file', new File([content], 'teste.txt', { type: 'text/plain' }));

  return fetch(`${baseUrl}/upload`, {
    method: 'POST',
    headers: {
      'x-user-id': owner,
    },
    body: formData,
  });
}

beforeEach(() => {
  if (!server) {
    server = app.listen(0);
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
  }

  documentRepository.clearAll();
  cleanStorageDirectory();
});

after(() => {
  if (server) {
    server.close();
  }

  cleanStorageDirectory();
});

test('GET /health retorna status ok', async () => {
  const response = await fetch(`${baseUrl}/health`);
  const body = await response.json();

  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(body, { status: 'ok' });
});

test('POST /upload cria metadados do documento', async () => {
  const response = await uploadDocument({ owner: 'user-1' });
  const body = await response.json();

  assert.strictEqual(response.status, 201);
  assert.ok(body.id);
  assert.strictEqual(body.originalName, 'teste.txt');
  assert.strictEqual(body.owner, 'user-1');
  assert.strictEqual(typeof body.size, 'number');
  assert.ok(body.uploadedAt);
});

test('POST /upload falha sem arquivo', async () => {
  const response = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    headers: {
      'x-user-id': 'user-1',
    },
  });

  const body = await response.json();

  assert.strictEqual(response.status, 400);
  assert.strictEqual(body.error, 'Arquivo é obrigatório para upload.');
});

test('GET /documents lista apenas documentos do usuário', async () => {
  await uploadDocument({ owner: 'user-1', content: 'conteudo user 1' });
  await uploadDocument({ owner: 'user-2', content: 'conteudo user 2' });

  const response = await fetch(`${baseUrl}/documents`, {
    headers: {
      'x-user-id': 'user-1',
    },
  });

  const body = await response.json();

  assert.strictEqual(response.status, 200);
  assert.strictEqual(body.length, 1);
  assert.strictEqual(body[0].owner, 'user-1');
});

test('GET /documents/:id/download faz download do documento do dono', async () => {
  const uploadResponse = await uploadDocument({ owner: 'user-1', content: 'download-ok' });
  const uploadBody = await uploadResponse.json();

  const response = await fetch(`${baseUrl}/documents/${uploadBody.id}/download`, {
    headers: {
      'x-user-id': 'user-1',
    },
  });

  const downloadedText = Buffer.from(await response.arrayBuffer()).toString('utf8');

  assert.strictEqual(response.status, 200);
  assert.strictEqual(downloadedText, 'download-ok');
});

test('GET /documents/:id/download retorna 404 para documento inexistente', async () => {
  const response = await fetch(`${baseUrl}/documents/inexistente/download`, {
    headers: {
      'x-user-id': 'user-1',
    },
  });

  const body = await response.json();

  assert.strictEqual(response.status, 404);
  assert.strictEqual(body.error, 'Documento não encontrado.');
});

test('GET /documents/:id/download retorna 403 para usuário sem permissão', async () => {
  const uploadResponse = await uploadDocument({ owner: 'user-1', content: 'privado' });
  const uploadBody = await uploadResponse.json();

  const response = await fetch(`${baseUrl}/documents/${uploadBody.id}/download`, {
    headers: {
      'x-user-id': 'user-2',
    },
  });

  const body = await response.json();

  assert.strictEqual(response.status, 403);
  assert.strictEqual(body.error, 'Você não tem permissão para acessar este documento.');
});
