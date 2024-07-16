import { GenesisBlock } from "../../genesis-block";
import { IFIAHibrida } from "../../paradigmas/hibrido/fia-hibrida";

/**
 * Bloque génesis para la construcción de sistemas
 * AlephScript basados en la ejecución de Alephs (conjuntos infinitos),
 * como unidades fundamentales de inteligencia artificial (FIAs)
 * operando sobre un cierto contexto-ambiente IMundo.
 */
export interface IApp extends IFIAHibrida {

    debil: GenesisBlock;
    fuerte: GenesisBlock;
    dummy: GenesisBlock;

}