/**
 * Jest setup file
 */

// Mock MCP Gateway for all tests
jest.mock('../services/mcp-gateway', () => ({
  mcpGateway: {
    callTool: jest.fn(),
    isConnected: jest.fn().mockReturnValue(true),
    getStatus: jest.fn().mockReturnValue({
      connected: true,
      url: 'http://localhost:3007',
      cachedSessions: 0,
      lastHealthCheck: null,
    }),
    initialize: jest.fn().mockResolvedValue(undefined),
    getSessionCached: jest.fn(),
    invalidateSession: jest.fn(),
    clearSessionCache: jest.fn(),
  },
}));

// Mock Socket.IO Service
jest.mock('../services/socketio.service', () => ({
  socketIOService: {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn(),
    isConnected: jest.fn().mockReturnValue(false),
    getStatus: jest.fn().mockReturnValue({
      connected: false,
      room: 'AAIA_ROOM',
      sseClients: 0,
      bufferedEvents: 0,
    }),
    registerSSEClient: jest.fn(),
    unregisterSSEClient: jest.fn(),
    emitToRoom: jest.fn(),
  },
}));

// Silence logs during tests
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Global test timeout
jest.setTimeout(10000);
