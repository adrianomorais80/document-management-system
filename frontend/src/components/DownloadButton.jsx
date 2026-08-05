import { useState } from 'react';

export default function DownloadButton({ document, onDownload }) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    if (!document?.id) {
      return;
    }

    setIsDownloading(true);

    try {
      await onDownload(document);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <button type="button" onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? 'Baixando...' : 'Baixar'}
    </button>
  );
}