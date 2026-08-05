import { useEffect, useState } from 'react';
import UploadComponent from '../components/UploadComponent';
import DocumentList from '../components/DocumentList';
import {
  uploadDocument,
  listDocuments,
  downloadDocument,
} from '../services/documentApi';

const DEFAULT_USER = 'user-demo';

export default function DocumentsPage() {
  const [userId, setUserId] = useState(DEFAULT_USER);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadDocuments(currentUserId) {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await listDocuments({ userId: currentUserId });
      setDocuments(response);
    } catch (error) {
      setErrorMessage(error.message || 'Não foi possível carregar a lista.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments(userId);
  }, [userId]);

  async function handleUpload(file) {
    await uploadDocument({ file, userId });
    await loadDocuments(userId);
  }

  async function handleDownload(document) {
    await downloadDocument({
      id: document.id,
      userId,
      filename: document.originalName,
    });
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Document Management System</h1>
      <p>Gestão simples de documentos com armazenamento local no backend.</p>

      <section>
        <label htmlFor="user-id-input">Usuário</label>
        <input
          id="user-id-input"
          type="text"
          value={userId}
          onChange={(event) => setUserId(event.target.value.trim() || DEFAULT_USER)}
          placeholder="Informe o x-user-id"
        />
      </section>

      <UploadComponent onUpload={handleUpload} />

      {isLoading ? <p>Carregando documentos...</p> : null}
      {errorMessage ? <p>{errorMessage}</p> : null}

      <DocumentList documents={documents} onDownload={handleDownload} />
    </main>
  );
}