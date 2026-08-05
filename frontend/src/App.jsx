import { useCallback, useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import {
  uploadDocument,
  listDocuments,
  downloadDocument,
} from './services/documentApi';

const DEFAULT_USER = 'user-demo';

export default function App() {
  const [userIdInput, setUserIdInput] = useState(DEFAULT_USER);
  const [activeUserId, setActiveUserId] = useState(DEFAULT_USER);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDocuments = useCallback(async (owner) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await listDocuments({ userId: owner });
      setDocuments(data);
    } catch (error) {
      setErrorMessage(error.message || 'Nao foi possivel carregar documentos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments(activeUserId);
  }, [activeUserId, loadDocuments]);

  async function handleUpload(file) {
    await uploadDocument({ file, userId: activeUserId });
    await loadDocuments(activeUserId);
  }

  async function handleDownload(document) {
    await downloadDocument({
      id: document.id,
      userId: activeUserId,
      filename: document.originalName,
    });
  }

  function handleUserSubmit(event) {
    event.preventDefault();
    setActiveUserId(userIdInput.trim() || DEFAULT_USER);
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Document Management System</h1>
      <p>Upload, listagem e download com armazenamento local no backend.</p>

      <section>
        <h2>Usuario ativo</h2>
        <form onSubmit={handleUserSubmit}>
          <input
            type="text"
            value={userIdInput}
            onChange={(event) => setUserIdInput(event.target.value)}
            placeholder="Informe o x-user-id"
          />
          <button type="submit">Aplicar</button>
        </form>
        <p>Atual: {activeUserId}</p>
      </section>

      <UploadComponent onUpload={handleUpload} />

      {isLoading ? <p>Carregando documentos...</p> : null}
      {errorMessage ? <p>{errorMessage}</p> : null}

      <DocumentList documents={documents} onDownload={handleDownload} />
    </main>
  );
}
