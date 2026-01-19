/**
 * @fia/core - Core interfaces and types for FIA AI Framework
 * 
 * @épica ALEPHSCRIPT-MIGRATION-1.0.0
 */

/**
 * Base interface for all FIA components
 */
export interface iFIA {
  nombre: string;
  mundo: IMundo;
  instanciar(): Promise<void>;
  razona(percepto: IPercepto): IAccion[];
}

/**
 * Interface for perception components
 */
export interface IPercepto {
  tipo: string;
  fuente?: string;
  payload: Record<string, unknown>;
}

/**
 * Interface for action components
 */
export interface IAccion {
  tipo: string;
  payload: Record<string, unknown>;
}

/**
 * Mundo - state of the environment
 */
export interface IMundo {
  nombre: string;
  entidades: unknown[];
  relaciones: unknown[];
  tiempo: number;
}

/**
 * Base types for FIA framework
 */
export type FIAComponent = iFIA & (IPercepto | IAccion);

/**
 * System message interface
 */
export interface ISystemMessage {
  message: string;
  timestamp?: Date;
  level?: 'info' | 'warning' | 'error';
}

export * from './interfaces';
export * from './types';
