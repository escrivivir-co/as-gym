# AAIA Backend

REST API Gateway for AAIAGallery - connects Angular frontend to MCP AAIA Server.

## Architecture

```
Angular Frontend <--HTTP:8007--> AAIA Backend <--MCP:3007--> MCPAAIAServer
                                              <--WS:3000--> AlephScriptClient
```

## Quick Start

```bash
# Install dependencies
npm install

# Development mode
npm run start:dev

# Production build
npm run build
npm start
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /api | API info |
| **Sessions** | | |
| POST | /api/sessions | Create session |
| GET | /api/sessions | List sessions |
| GET | /api/sessions/:id | Get session |
| DELETE | /api/sessions/:id | Destroy session |
| **FIAs** | | |
| GET | /api/fias | List FIAs |
| POST | /api/fias/:id/step | Step FIA |
| POST | /api/fias/:id/percepto | Send percepto |
| GET | /api/fias/:id/state | Get FIA state |
| **Mundo** | | |
| GET | /api/mundo | Get world state |
| POST | /api/mundo/query | Query world |
| **Apps** | | |
| GET | /api/apps | List apps |
| GET | /api/apps/:id | Get app details |

## Configuration

| Env Var | Default | Description |
|---------|---------|-------------|
| PORT | 8007 | HTTP server port |
| MCP_AAIA_URL | http://localhost:3007 | MCP AAIA Server URL |
| SOCKETIO_URL | http://localhost:3000 | Socket.IO server URL |
| LOG_LEVEL | info | Winston log level |

## Dependencies

- `MCPAAIAServer` running on port 3007
- `mcp-channels-sdk` Socket.IO server on port 3000 (optional, for real-time)
