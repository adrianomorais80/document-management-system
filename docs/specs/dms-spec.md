# Especificação - Document Management System

## 1. Objetivo

Entregar um sistema web simples para upload, listagem e download de documentos por usuário, com arquivos gravados localmente e metadados mantidos em memória.

## 2. Escopo

### Dentro do escopo

- Upload de documentos
- Listagem de documentos
- Download de documentos
- Gestão simples por usuário via header `x-user-id`
- Interface frontend React integrada ao backend via prefixo `/api`
- Endpoint de saúde do backend

### Fora do escopo

- Armazenamento externo ou em nuvem
- Versionamento de documentos
- Autenticação completa (JWT/OAuth)
- Persistência de metadados em banco de dados

## 3. Requisitos funcionais

| ID    | Requisito |
| ----- | --------- |
| RF-01 | O sistema deve aceitar upload de arquivo no endpoint `POST /upload` com `multipart/form-data` no campo `file`. |
| RF-02 | O sistema deve exigir o header `x-user-id` nas operações de upload, listagem e download. |
| RF-03 | O sistema deve criar metadados do documento após upload bem-sucedido (id, originalName, size, uploadedAt, owner). |
| RF-04 | O sistema deve listar documentos somente do usuário informado em `x-user-id` no endpoint `GET /documents`. |
| RF-05 | O sistema deve permitir download de documento por identificador no endpoint `GET /documents/:id/download`. |
| RF-06 | O sistema deve bloquear download de documento de outro usuário com retorno `403`. |
| RF-07 | O sistema deve retornar `404` ao tentar baixar documento inexistente. |
| RF-08 | O sistema deve expor `GET /health` retornando status de disponibilidade. |

## 4. Requisitos não funcionais

| ID     | Requisito |
| ------ | --------- |
| RNF-01 | Arquivos devem ser gravados no filesystem local em `backend/storage` usando `multer` com `diskStorage`. |
| RNF-02 | Metadados devem ficar em memória nesta fase (sem banco). |
| RNF-03 | Limite de upload deve ser configurável por `MAX_FILE_SIZE_BYTES`, com padrão de `10 MB`. |
| RNF-04 | Porta do backend deve ser configurável por `PORT`, com padrão `3000`. |
| RNF-05 | Backend deve seguir camadas: `routes -> controllers -> services -> repositories`. |
| RNF-06 | Frontend deve consumir o backend por `fetch` usando prefixo `/api` (proxy do Vite). |

## 5. Modelo de dados (metadados do documento)

### Metadados públicos (resposta da API)

| Campo        | Tipo   | Descrição |
| ------------ | ------ | --------- |
| id           | string | Identificador único (UUID). |
| originalName | string | Nome original do arquivo enviado. |
| size         | number | Tamanho em bytes. |
| uploadedAt   | string | Data/hora do upload no formato ISO 8601. |
| owner        | string | Identificador do usuário dono. |

### Campos internos de persistência (não retornados pela API pública)

| Campo       | Tipo   | Descrição |
| ----------- | ------ | --------- |
| storedName  | string | Nome sanitizado e prefixado com timestamp para armazenamento local. |
| storagePath | string | Caminho do arquivo salvo em disco. |
| mimeType    | string | Tipo MIME informado no upload. |

## 6. Contratos de API

### POST /upload

- Objetivo: enviar um documento e registrar metadados.
- Headers obrigatórios: `x-user-id`
- Body: `multipart/form-data` com campo `file`

Resposta de sucesso:
- Status: `201`
- Body:

```json
{
  "id": "0f6d8fef-8a1d-4bd4-9386-5797984e4c62",
  "originalName": "arquivo.pdf",
  "size": 12345,
  "uploadedAt": "2026-08-05T15:00:00.000Z",
  "owner": "user-demo"
}
```

Respostas de erro:
- `400` com `{ "error": "Header x-user-id é obrigatório." }`
- `400` com `{ "error": "Arquivo é obrigatório para upload." }`
- `413` com `{ "error": "Arquivo excede o limite permitido." }`
- `500` com `{ "error": "Erro interno do servidor." }`

### GET /documents

- Objetivo: listar metadados dos documentos do usuário requisitante.
- Headers obrigatórios: `x-user-id`

Resposta de sucesso:
- Status: `200`
- Body:

```json
[
  {
    "id": "0f6d8fef-8a1d-4bd4-9386-5797984e4c62",
    "originalName": "arquivo.pdf",
    "size": 12345,
    "uploadedAt": "2026-08-05T15:00:00.000Z",
    "owner": "user-demo"
  }
]
```

Respostas de erro:
- `400` com `{ "error": "Header x-user-id é obrigatório." }`
- `500` com `{ "error": "Erro interno do servidor." }`

### GET /documents/:id/download

- Objetivo: baixar o conteúdo binário do documento pelo identificador.
- Headers obrigatórios: `x-user-id`
- Path params: `id`

Resposta de sucesso:
- Status: `200`
- Body: arquivo binário
- Headers esperados:
  - `Content-Type`: MIME do arquivo
  - `Content-Disposition`: attachment com nome original

Respostas de erro:
- `400` com `{ "error": "Header x-user-id é obrigatório." }`
- `400` com `{ "error": "Parâmetro id é obrigatório." }`
- `403` com `{ "error": "Você não tem permissão para acessar este documento." }`
- `404` com `{ "error": "Documento não encontrado." }`
- `500` com `{ "error": "Erro interno do servidor." }`

### GET /health

- Objetivo: verificar se a aplicação backend está disponível.

Resposta de sucesso:
- Status: `200`
- Body:

```json
{
  "status": "ok"
}
```

## 7. Decisões arquiteturais

- Backend estruturado em camadas:
  - `routes`: configuração de endpoints e middleware de upload.
  - `controllers`: adaptação HTTP (headers, params, responses).
  - `services`: regras de negócio e autorização.
  - `repositories`: persistência de metadados em memória.
- Armazenamento local obrigatório usando `multer.diskStorage` em `backend/storage`.
- Nome de arquivo armazenado com sanitização simples e prefixo de timestamp.
- Frontend React por componentes com serviço dedicado de API (`fetch` + `/api`).

## 8. Plano de execução

Etapas executadas e refletidas no código:

1. Estruturação do backend por camadas (`routes`, `controllers`, `services`, `repositories`).
2. Implementação do repositório em memória para metadados dos documentos.
3. Implementação das regras de negócio no serviço (validações, criação de metadados, autorização de download).
4. Implementação das rotas HTTP com `multer` e limite configurável por ambiente.
5. Implementação de tratamento global de erros HTTP no app.
6. Implementação de testes de integração do backend (`health`, upload, listagem, download, 403 e 404).
7. Implementação do frontend com componentes de upload, listagem e download.
8. Integração frontend-backend via serviço de API com prefixo `/api`.
