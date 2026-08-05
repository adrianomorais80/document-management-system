import DownloadButton from './DownloadButton';

function formatBytes(size) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentList({ documents, onDownload }) {
  return (
    <section>
      <h2>Documentos</h2>
      {documents.length === 0 ? (
        <p>Nenhum documento enviado para este usuário.</p>
      ) : (
        <ul>
          {documents.map((document) => (
            <li key={document.id}>
              <strong>{document.originalName}</strong>
              {' - '}
              {formatBytes(document.size)}
              {' - '}
              {new Date(document.uploadedAt).toLocaleString('pt-BR')}
              {' '}
              <DownloadButton
                document={document}
                onDownload={onDownload}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}