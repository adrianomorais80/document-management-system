import { useState } from 'react';

export default function UploadComponent({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage('Selecione um arquivo antes de enviar.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      event.target.reset();
    } catch (error) {
      setErrorMessage(error.message || 'Não foi possível enviar o arquivo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Enviar documento</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="file"
          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      {errorMessage ? <p>{errorMessage}</p> : null}
    </section>
  );
}