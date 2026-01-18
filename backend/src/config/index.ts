/**
 * Configuration for AAIA Backend
 */

export const config = {
  // Server
  port: parseInt(process.env.PORT || '8007', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MCP AAIA Server
  mcpAaia: {
    host: process.env.MCP_AAIA_HOST || 'localhost',
    port: parseInt(process.env.MCP_AAIA_PORT || '3007', 10),
    url: process.env.MCP_AAIA_URL || 'http://localhost:3007',
  },
  
  // Socket.IO (AlephScriptClient)
  socketio: {
    url: process.env.SOCKETIO_URL || 'http://localhost:3000',
    room: process.env.AAIA_ROOM || 'AAIA_ROOM',
  },
  
  // Timeouts
  timeouts: {
    mcpRequest: 30000, // 30s
    socketEmit: 10000, // 10s
  },
};
