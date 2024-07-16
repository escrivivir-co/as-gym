import { Automata } from "./automata";
import { GramaticaAritmetica, GramaticaAritmeticaX } from "./gramatica";

// Uso del autómata con la gramática de expresiones aritméticas
export const automataAritmetico = new Automata(new GramaticaAritmetica());

export const automataAritmeticoX = new Automata(new GramaticaAritmeticaX());
