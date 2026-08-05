const USER_HEADER = 'x-user-id';

function ensureSuccess(response, fallbackMessage) {
  if (response.ok) {
    return response;
  }

  return response.json().then((body) => {
    const errorMessage = body?.error || fallbackMessage;
    throw new Error(errorMessage);
  }).catch(() => {
    throw new Error(fallbackMessage);
  });
}

export async function uploadDocument({ file, userId }) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      [USER_HEADER]: userId,
    },
    body: formData,
  });

  await ensureSuccess(response, 'Falha ao enviar documento.');
  return response.json();
}

export async function listDocuments({ userId }) {
  const response = await fetch('/api/documents', {
    headers: {
      [USER_HEADER]: userId,
    },
  });

  await ensureSuccess(response, 'Falha ao listar documentos.');
  return response.json();
}

export async function downloadDocument({ id, userId, filename }) {
  const response = await fetch(`/api/documents/${id}/download`, {
    headers: {
      [USER_HEADER]: userId,
    },
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