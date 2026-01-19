/**
 * @fia/paradigmas - Los 10 paradigmas de IA del framework FIA
 * 
 * @épica ALEPHSCRIPT-MIGRATION-1.0.0
 * @fecha 2026-01-19
 * @migrado-desde alephscript/src/FIA/paradigmas
 */

// Types (definir primero)
export type FIAParadigma = 
    | 'logica'
    | 'simbolica'
    | 'conexionista'
    | 'sbc'
    | 'sbr'
    | 'situada'
    | 'cientifica'
    | 'gramaticas'
    | 'sistemas'
    | 'hibrido';

export const PARADIGMAS: FIAParadigma[] = [
    'logica',
    'simbolica', 
    'conexionista',
    'sbc',
    'sbr',
    'situada',
    'cientifica',
    'gramaticas',
    'sistemas',
    'hibrido'
];

// Interfaces base
export * from './interfaces/IParadigma';
export * from './interfaces/IFIACompleta';

// Paradigmas
export * from './logica';
export * from './simbolica';
export * from './conexionista';
export * from './sbc';
export * from './sbr';
export * from './situada';
export * from './cientifica';
export * from './gramaticas';
export * from './sistemas';
export * from './hibrido';

// Factory
export { createFIA, FIAFactory, IFIAConfig } from './factory';
