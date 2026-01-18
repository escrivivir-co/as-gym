import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  AAIASession,
  AAIASessionMeta,
  IFIAInfo,
  IMundoState,
  IPercepto,
  IEferencia,
  IAAIAApp,
  AAIACreateSessionResult,
  AAIAListFIAsResult,
  AAIAStepFIAResult,
  AAIASendPerceptoResult,
} from '../../models';
import { RunStateEnum } from '../../models';

/**
 * Response wrapper for AAIA API endpoints
 */
export interface AAIAApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Service for AAIA (Arquitectura de Agentes de IA Autónomos) operations.
 * 
 * Connects to REST API backend which delegates to MCP AAIA Server (port 3007).
 * Pattern follows PrologService from PrologEditor.
 * 
 * @see PrologEditor/frontend/src/app/services/prolog.service.ts
 */
@Injectable({
  providedIn: 'root'
})
export class AAIAService {
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';
  currentSessionId: string | null = null;

  constructor(private http: HttpClient) {}

  // ============================================
  // App Catalog Operations
  // ============================================

  /**
   * Get list of available AAIA apps
   */
  getApps(): Observable<AAIAApiResponse<IAAIAApp[]>> {
    return this.http.get<AAIAApiResponse<IAAIAApp[]>>(`${this.apiUrl}/aaia/apps`);
  }

  /**
   * Get details of a specific app
   */
  getApp(appId: string): Observable<AAIAApiResponse<IAAIAApp>> {
    return this.http.get<AAIAApiResponse<IAAIAApp>>(`${this.apiUrl}/aaia/apps/${appId}`);
  }

  // ============================================
  // Session Management
  // ============================================

  /**
   * Create a new AAIA session with a specific app
   */
  createSession(appId: string): Observable<AAIACreateSessionResult> {
    return this.http.post<AAIACreateSessionResult>(`${this.apiUrl}/aaia/sessions`, { appId });
  }

  /**
   * List all active sessions
   */
  listSessions(): Observable<AAIAApiResponse<AAIASessionMeta[]>> {
    return this.http.get<AAIAApiResponse<AAIASessionMeta[]>>(`${this.apiUrl}/aaia/sessions`);
  }

  /**
   * Get session details
   */
  getSession(sessionId: string): Observable<AAIAApiResponse<AAIASession>> {
    return this.http.get<AAIAApiResponse<AAIASession>>(`${this.apiUrl}/aaia/sessions/${sessionId}`);
  }

  /**
   * Destroy a session
   */
  destroySession(sessionId: string): Observable<AAIAApiResponse<void>> {
    return this.http.delete<AAIAApiResponse<void>>(`${this.apiUrl}/aaia/sessions/${sessionId}`);
  }

  // ============================================
  // FIA Operations
  // ============================================

  /**
   * List FIAs in a session
   */
  listFIAs(sessionId?: string): Observable<AAIAListFIAsResult> {
    const id = sessionId || this.currentSessionId;
    return this.http.get<AAIAListFIAsResult>(`${this.apiUrl}/aaia/sessions/${id}/fias`);
  }

  /**
   * Execute one step of a FIA
   */
  stepFIA(fiaIndex: number, sessionId?: string): Observable<AAIAStepFIAResult> {
    const id = sessionId || this.currentSessionId;
    return this.http.post<AAIAStepFIAResult>(`${this.apiUrl}/aaia/sessions/${id}/fias/${fiaIndex}/step`, {});
  }

  /**
   * Set FIA run state (PLAY, PAUSE, STOP)
   */
  setFIAState(fiaIndex: number, state: RunStateEnum, sessionId?: string): Observable<AAIAApiResponse<IFIAInfo>> {
    const id = sessionId || this.currentSessionId;
    return this.http.patch<AAIAApiResponse<IFIAInfo>>(
      `${this.apiUrl}/aaia/sessions/${id}/fias/${fiaIndex}/state`,
      { state }
    );
  }

  // ============================================
  // Mundo Operations
  // ============================================

  /**
   * Query mundo state
   */
  queryMundo(sessionId?: string): Observable<AAIAApiResponse<IMundoState>> {
    const id = sessionId || this.currentSessionId;
    return this.http.get<AAIAApiResponse<IMundoState>>(`${this.apiUrl}/aaia/sessions/${id}/mundo`);
  }

  // ============================================
  // Percepto/Eferencia Operations
  // ============================================

  /**
   * Send percepto to the mundo (stimulus for FIAs)
   */
  sendPercepto(percepto: IPercepto, sessionId?: string): Observable<AAIASendPerceptoResult> {
    const id = sessionId || this.currentSessionId;
    return this.http.post<AAIASendPerceptoResult>(
      `${this.apiUrl}/aaia/sessions/${id}/perceptos`,
      percepto
    );
  }

  /**
   * Get last eferencia from a FIA
   */
  getEferencia(fiaIndex: number, sessionId?: string): Observable<AAIAApiResponse<IEferencia>> {
    const id = sessionId || this.currentSessionId;
    return this.http.get<AAIAApiResponse<IEferencia>>(
      `${this.apiUrl}/aaia/sessions/${id}/fias/${fiaIndex}/eferencia`
    );
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Set current session for subsequent operations
   */
  setCurrentSession(sessionId: string): void {
    this.currentSessionId = sessionId;
  }

  /**
   * Clear current session
   */
  clearCurrentSession(): void {
    this.currentSessionId = null;
  }
}
