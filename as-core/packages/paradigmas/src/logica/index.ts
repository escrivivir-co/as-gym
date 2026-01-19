/**
 * Paradigma Lógica - Resolución Prolog
 * 
 * Implementación del paradigma de IA basado en lógica de primer orden
 * con unificación y resolución SLD.
 * 
 * @migrado-desde alephscript/src/FIA/paradigmas/logica
 * @épica ALEPHSCRIPT-MIGRATION-1.0.0
 */

// Tipos base
export * from './types';

// Componentes del unificador
export * from './unificador/dT';
export * from './unificador/dTF';
export * from './unificador/UnificadorGeneral';

// Componentes de resolución
export * from './resolucion/Nodo';
export * from './resolucion/Parser';
export * from './resolucion/Resolver';

// Paradigma integrado
export * from './ParadigmaLogica';
