const USER_HEADER = 'x-user-id';

function createUserHeaders(userId) {
  return {
    [USER_HEADER]: userId,
  };
}

async function ensureSuccess(response, fallbackMessage) {
  if (response.ok) {
    return response;
  }

  let message = fallbackMessage;

  try {
    const body = await response.json();
    if (body?.error) {
      message = body.error;
    }
  } catch {
    message = fallbackMessage;
  }

  throw new Error(message);
}

export async function uploadDocument({ file, userId }) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: createUserHeaders(userId),
    body: formData,
  });

  await ensureSuccess(response, 'Falha ao enviar documento.');
  return response.json();
}

export async function listDocuments({ userId }) {
  const response = await fetch('/api/documents', {
    headers: createUserHeaders(userId),
  });

  await ensureSuccess(response, 'Falha ao listar documentos.');
  return response.json();
}

export async function downloadDocument({ id, userId, filename }) {
  const response = await fetch(`/api/documents/${id}/download`, {
    headers: createUserHeaders(userId),
  });

  await ensureSuccess(response, 'Falha ao baixar documento.');

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename || 'documento';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}