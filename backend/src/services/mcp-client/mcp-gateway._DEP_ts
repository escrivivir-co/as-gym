/**
 * MCP Gateway Service
 * 
 * Connects to MCPAAIAServer (port 3007) via HTTP/SSE transport
 * Acts as bridge between REST API and MCP protocol
 * 
 * Features:
 * - Session cache for fast lookups
 * - Retry logic with exponential backoff
 * - Tool mapping and validation
 * - Health monitoring
 */

import { config } from '../config';
import { logger } from '../utils/logger';
import { AAIASessionMeta } from '../types';

// ============================================
// MCP Protocol Types
// ============================================

interface MCPToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

interface MCPToolResult {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

interface MCPListToolsResult {
  tools: Array<{
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
  }>;
}

// ============================================
// Known AAIA MCP Tools
// ============================================

const AAIA_MCP_TOOLS = [
  'aaia_create_session',
  'aaia_destroy_session',
  'aaia_list_sessions',
  'aaia_get_session',
  'aaia_list_fias',
  'aaia_step_fia',
  'aaia_set_fia_state',
  'aaia_get_eferencia',
  'aaia_send_percepto',
  'aaia_query_mundo',
  'aaia_list_paradigmas',
] as const;

type AAIAToolName = typeof AAIA_MCP_TOOLS[number];

// ============================================
// Session Cache
// ============================================

interface CachedSession {
  meta: AAIASessionMeta;
  cachedAt: Date;
}

class SessionCache {
  private cache: Map<string, CachedSession> = new Map();
  private readonly TTL_MS = 30000; // 30 seconds

  get(sessionId: string): AAIASessionMeta | null {
    const cached = this.cache.get(sessionId);
    if (!cached) return null;
    
    // Check TTL
    if (Date.now() - cached.cachedAt.getTime() > this.TTL_MS) {
      this.cache.delete(sessionId);
      return null;
    }
    
    return cached.meta;
  }

  set(sessionId: string, meta: AAIASessionMeta): void {
    this.cache.set(sessionId, {
      meta,
      cachedAt: new Date(),
    });
  }

  invalidate(sessionId: string): void {
    this.cache.delete(sessionId);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

// ============================================
// MCP Gateway Class
// ============================================

class MCPGateway {
  private connected: boolean = false;
  private baseUrl: string;
  private sessionCache: SessionCache;
  private availableTools: Set<string> = new Set();
  private lastHealthCheck: Date | null = null;
  private retryCount: number = 0;
  private readonly MAX_RETRIES = 3;

  constructor() {
    this.baseUrl = config.mcpAaia.url;
    this.sessionCache = new SessionCache();
  }

  // ============================================
  // Initialization & Health
  // ============================================

  /**
   * Initialize connection to MCP server
   */
  async initialize(): Promise<void> {
    try {
      // Try health endpoint first
      const healthOk = await this.checkHealth();
      
      if (healthOk) {
        // Discover available tools
        await this.discoverTools();
        this.connected = true;
        this.retryCount = 0;
        logger.info(`MCP Gateway connected to ${this.baseUrl}`);
        logger.info(`Available tools: ${this.availableTools.size}`);
      } else {
        this.connected = false;
        logger.warn(`MCP server not responding at ${this.baseUrl}`);
      }
    } catch (error) {
      logger.warn(`MCP Gateway initialization failed:`, error);
      this.connected = false;
    }
  }

  /**
   * Check if MCP server is healthy
   */
  private async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      
      this.lastHealthCheck = new Date();
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Discover available MCP tools
   */
  private async discoverTools(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/tools/list`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const result = await response.json() as MCPListToolsResult;
        this.availableTools = new Set(result.tools.map(t => t.name));
      } else {
        // Assume all known tools are available
        this.availableTools = new Set(AAIA_MCP_TOOLS);
      }
    } catch {
      // Assume all known tools are available
      this.availableTools = new Set(AAIA_MCP_TOOLS);
    }
  }

  /**
   * Check if gateway is connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Get connection status details
   */
  getStatus(): { connected: boolean; url: string; cachedSessions: number; lastHealthCheck: string | null } {
    return {
      connected: this.connected,
      url: this.baseUrl,
      cachedSessions: this.sessionCache.size,
      lastHealthCheck: this.lastHealthCheck?.toISOString() || null,
    };
  }

  // ============================================
  // Tool Calling
  // ============================================

  /**
   * Call an MCP tool with retry logic
   */
  async callTool(name: string, args: Record<string, unknown>): Promise<Record<string, unknown>> {
    // Validate tool name
    if (!AAIA_MCP_TOOLS.includes(name as AAIAToolName)) {
      logger.warn(`Unknown MCP tool: ${name}`);
    }

    const toolCall: MCPToolCall = { name, arguments: args };
    
    logger.debug(`MCP callTool: ${name}`, { args });

    return this.callWithRetry(toolCall);
  }

  /**
   * Call with exponential backoff retry
   */
  private async callWithRetry(toolCall: MCPToolCall, attempt: number = 1): Promise<Record<string, unknown>> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/tools/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toolCall),
        signal: AbortSignal.timeout(config.timeouts.mcpRequest),
      });

      if (!response.ok) {
        throw new Error(`MCP call failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json() as MCPToolResult;
      
      // Reset retry count on success
      this.retryCount = 0;
      this.connected = true;

      if (result.isError) {
        throw new Error(result.content[0]?.text || 'MCP tool error');
      }

      // Parse the text content as JSON if possible
      return this.parseResult(result);
    } catch (error) {
      // Retry logic
      if (attempt < this.MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        logger.warn(`MCP call failed, retrying in ${delay}ms (attempt ${attempt}/${this.MAX_RETRIES})`);
        await this.sleep(delay);
        return this.callWithRetry(toolCall, attempt + 1);
      }

      this.connected = false;
      this.retryCount++;
      logger.error(`MCP callTool ${toolCall.name} failed after ${this.MAX_RETRIES} attempts:`, error);
      throw error;
    }
  }

  /**
   * Parse MCP tool result
   */
  private parseResult(result: MCPToolResult): Record<string, unknown> {
    const textContent = result.content.find(c => c.type === 'text')?.text;
    
    if (textContent) {
      try {
        return JSON.parse(textContent);
      } catch {
        return { text: textContent };
      }
    }

    return result as unknown as Record<string, unknown>;
  }

  /**
   * Sleep helper for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================
  // Session Cache Methods
  // ============================================

  /**
   * Get cached session or fetch from MCP
   */
  async getSessionCached(sessionId: string): Promise<AAIASessionMeta | null> {
    // Try cache first
    const cached = this.sessionCache.get(sessionId);
    if (cached) {
      logger.debug(`Session ${sessionId} found in cache`);
      return cached;
    }

    // Fetch from MCP
    try {
      const result = await this.callTool('aaia_get_session', { sessionId });
      if (result.success && result.session) {
        const session = result.session as AAIASessionMeta;
        this.sessionCache.set(sessionId, session);
        return session;
      }
    } catch {
      // Session not found
    }

    return null;
  }

  /**
   * Invalidate session cache (on destroy or update)
   */
  invalidateSession(sessionId: string): void {
    this.sessionCache.invalidate(sessionId);
  }

  /**
   * Clear all cached sessions
   */
  clearSessionCache(): void {
    this.sessionCache.clear();
  }
}

// Singleton instance
export const mcpGateway = new MCPGateway();
