# Document Management System com GitHub Copilot

<img src="https://octodex.github.com/images/Professortocat_v2.png" align="right" height="200px" />

Hey adrianomorais80!

Mona here. I'm done preparing your exercise. Hope you enjoy! 💚

Remember, it's self-paced so feel free to take a break! ☕️

[![](https://img.shields.io/badge/Go%20to%20Exercise-%E2%86%92-1f883d?style=for-the-badge&logo=github&labelColor=197935)](https://github.com/adrianomorais80/document-management-system/issues/1)

## Checklist Operacional (Resumo da Spec)

### 1) Preparação do ambiente

- [ ] Instalar dependências do backend (`cd backend && npm install`).
- [ ] Instalar dependências do frontend (`cd frontend && npm install`).
- [ ] Confirmar Node compatível com o projeto.

### 2) Configuração

- [ ] Definir `PORT` para o backend (padrão: `3000`).
- [ ] Definir `MAX_FILE_SIZE_BYTES` quando necessário (padrão: `10485760` = 10 MB).
- [ ] Confirmar diretório de armazenamento local em `backend/storage`.

### 3) Backend (Clean Architecture simples)

- [ ] Validar separação em camadas: `routes -> controllers -> services -> repositories`.
- [ ] Garantir upload local com `multer.diskStorage`.
- [ ] Garantir metadados em memória (sem banco de dados nesta fase).

### 4) Contratos de API

- [ ] `GET /health` retorna `200` com `{ "status": "ok" }`.
- [ ] `POST /upload` exige `x-user-id` e arquivo `file` (multipart/form-data).
- [ ] `GET /documents` lista apenas documentos do usuário em `x-user-id`.
- [ ] `GET /documents/:id/download` permite download apenas para o dono do documento.

### 5) Regras de erro esperadas

- [ ] `400` para ausência de `x-user-id`.
- [ ] `400` para upload sem arquivo.
- [ ] `403` para tentativa de download sem permissão.
- [ ] `404` para documento inexistente.
- [ ] `413` para arquivo acima do limite configurado.
- [ ] `500` para falhas internas não tratadas.

### 6) Frontend

- [ ] Consumir backend via prefixo `/api` (proxy do Vite).
- [ ] Implementar fluxo de upload com feedback de sucesso/erro.
- [ ] Implementar listagem por usuário.
- [ ] Implementar ação de download por documento.

### 7) Validação final

- [ ] Executar testes do backend (`cd backend && npm test`).
- [ ] Executar build do frontend (`cd frontend && npm run build`).
- [ ] Validar manualmente fluxo completo: upload -> listagem -> download.

---

&copy; 2025 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)

