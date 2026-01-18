/**
 * Apps Service - Business logic for app catalog
 * 
 * Reads from fia-catalog.json and provides app/paradigm information
 */

import { mcpGateway } from './mcp-gateway';
import { logger } from '../utils/logger';
import { ListAppsResponse, GetAppResponse, IAAIAApp, FIAParadigma } from '../types';
import * as fs from 'fs';
import * as path from 'path';

// Cache for the catalog
let catalogCache: Record<string, unknown> | null = null;
let catalogLoadedAt: Date | null = null;
const CACHE_TTL_MS = 60000; // 1 minute

export class AppsService {
  private catalogPath: string;

  constructor() {
    // Catalog is in AAIAGallery root
    this.catalogPath = path.resolve(__dirname, '../../../fia-catalog.json');
  }

  /**
   * Load catalog from disk (with caching)
   */
  private async loadCatalog(): Promise<Record<string, unknown>> {
    const now = new Date();
    
    // Return cached if still valid
    if (catalogCache && catalogLoadedAt && (now.getTime() - catalogLoadedAt.getTime() < CACHE_TTL_MS)) {
      return catalogCache;
    }

    try {
      const content = fs.readFileSync(this.catalogPath, 'utf-8');
      catalogCache = JSON.parse(content);
      catalogLoadedAt = now;
      logger.debug('Catalog loaded from disk');
      return catalogCache!;
    } catch (error) {
      logger.error('Failed to load catalog:', error);
      throw new Error('Failed to load app catalog');
    }
  }

  /**
   * List all available apps (paradigms)
   */
  async listApps(): Promise<ListAppsResponse> {
    logger.debug('Listing apps');
    
    const catalog = await this.loadCatalog();
    const paradigmas = catalog.paradigmas as Record<string, {
      id: string;
      nombre: string;
      descripcion?: string;
      capacidades?: string[];
    }>;

    const apps = Object.values(paradigmas).map(p => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      paradigmaPrincipal: p.id as FIAParadigma,
      fiasCount: 1, // Each paradigm template has 1 FIA
    }));

    return {
      success: true,
      apps,
      count: apps.length,
    };
  }

  /**
   * Get app details by ID
   */
  async getApp(appId: string): Promise<GetAppResponse> {
    logger.debug(`Getting app: ${appId}`);
    
    const catalog = await this.loadCatalog();
    const paradigmas = catalog.paradigmas as Record<string, unknown>;
    
    const paradigma = paradigmas[appId] as {
      id: string;
      nombre: string;
      descripcion?: string;
      capacidades?: string[];
      limitaciones?: string[];
      nivel_madurez?: string;
    } | undefined;

    if (!paradigma) {
      throw new Error(`App not found: ${appId}`);
    }

    // Convert paradigma to IAAIAApp format
    const app: IAAIAApp = {
      id: paradigma.id,
      nombre: paradigma.nombre,
      descripcion: paradigma.descripcion,
      paradigmaPrincipal: paradigma.id as FIAParadigma,
      fias: [{
        nombre: `${paradigma.nombre} FIA`,
        paradigma: paradigma.id as FIAParadigma,
        clase: `FIA${paradigma.id.charAt(0).toUpperCase() + paradigma.id.slice(1)}`,
        config: {
          capacidades: paradigma.capacidades,
          limitaciones: paradigma.limitaciones,
          nivel_madurez: paradigma.nivel_madurez,
        },
      }],
      mundoConfig: {
        nombre: `Mundo ${paradigma.nombre}`,
        modeloInicial: {},
      },
    };

    return {
      success: true,
      app,
    };
  }

  /**
   * List paradigms (alternative via MCP)
   */
  async listParadigmas(): Promise<{ paradigmas: Array<{ id: string; nombre: string; descripcion?: string }> }> {
    try {
      // Try MCP first
      const result = await mcpGateway.callTool('aaia_list_paradigmas', {});
      return {
        paradigmas: (result.paradigmas || []) as Array<{ id: string; nombre: string; descripcion?: string }>,
      };
    } catch {
      // Fallback to local catalog
      const list = await this.listApps();
      return {
        paradigmas: list.apps.map(a => ({
          id: a.id,
          nombre: a.nombre,
          descripcion: a.descripcion,
        })),
      };
    }
  }
}

// Singleton
export const appsService = new AppsService();
