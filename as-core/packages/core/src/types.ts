/**
 * Common types for the FIA framework
 */

/**
 * Search node representation
 */
export type SearchNode = {
  state: any;
  parent?: SearchNode;
  cost?: number;
  heuristic?: number;
};

/**
 * Grammar rule type
 */
export type GrammarRule = {
  left: string;
  right: string[];
};

/**
 * Dictionary entry type
 */
export type DictionaryEntry = {
  key: string;
  value: any;
  metadata?: Record<string, any>;
};

/**
 * System levels
 */
export type SystemLevel = 'debug' | 'info' | 'warning' | 'error';

/**
 * Thread types
 */
export type ThreadType = 
  | 'ops' 
  | 'dic' 
  | 'seed' 
  | 'sdk' 
  | 'grammar' 
  | 'aa' 
  | 'sb' 
  | 'runtime';
