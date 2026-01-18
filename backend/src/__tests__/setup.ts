/**
 * Jest setup file
 * 
 * @épica AAIA-BACKEND-1.0.0 (Backend as SoT - no mcp-gateway mock needed)
 */

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
