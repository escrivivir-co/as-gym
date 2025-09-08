/**
 * Base interface for all FIA components
 */
export interface iFIA {
  nombre: string;
  test(): void;
}

/**
 * Interface for perception components
 */
export interface IPercepto {
  percepto: any;
  procesar(): void;
}

/**
 * Interface for action components
 */
export interface IAccion {
  accion: any;
  ejecutar(): void;
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
