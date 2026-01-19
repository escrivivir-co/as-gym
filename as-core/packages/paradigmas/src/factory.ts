/**
 * FIAFactory - Factory para crear FIAs con paradigmas asignados
 * 
 * Patrón factory que instancia FIAs con paradigmas específicos
 * basándose en el catálogo de FIAs disponibles.
 * 
 * @épica ALEPHSCRIPT-MIGRATION-1.0.0
 */

import { IMundo } from '@fia/core';
import { IParadigma } from './interfaces/IParadigma';
import { FIACompletaBase, IFIACompleta } from './interfaces/IFIACompleta';
import { FIAParadigma, PARADIGMAS } from './index';

// Importar todos los paradigmas
import { ParadigmaLogica, ILogicaConfig } from './logica/ParadigmaLogica';
import { ParadigmaSimbolica } from './simbolica/ParadigmaSimbolica';
import { ParadigmaConexionista } from './conexionista/ParadigmaConexionista';
import { ParadigmaSBC } from './sbc/ParadigmaSBC';
import { ParadigmaSBR } from './sbr/ParadigmaSBR';
import { ParadigmaSituada } from './situada/ParadigmaSituada';
import { ParadigmaCientifica } from './cientifica/ParadigmaCientifica';
import { ParadigmaGramaticas } from './gramaticas/ParadigmaGramaticas';
import { ParadigmaSistemas } from './sistemas/ParadigmaSistemas';
import { ParadigmaHibrido } from './hibrido/ParadigmaHibrido';

/**
 * Configuración para crear una FIA
 */
export interface IFIAConfig {
    /** Nombre único de la FIA */
    nombre: string;
    /** Paradigma a usar */
    paradigma: FIAParadigma;
    /** Estado inicial del mundo */
    mundo?: IMundo;
    /** Configuración específica del paradigma */
    paradigmaConfig?: Record<string, unknown>;
}

/**
 * Registro de paradigmas disponibles
 */
const PARADIGMA_REGISTRY: Record<FIAParadigma, new () => IParadigma> = {
    logica: ParadigmaLogica,
    simbolica: ParadigmaSimbolica,
    conexionista: ParadigmaConexionista,
    sbc: ParadigmaSBC,
    sbr: ParadigmaSBR,
    situada: ParadigmaSituada,
    cientifica: ParadigmaCientifica,
    gramaticas: ParadigmaGramaticas,
    sistemas: ParadigmaSistemas,
    hibrido: ParadigmaHibrido,
};

/**
 * Factory para crear instancias de FIA
 */
export class FIAFactory {
    private static instance: FIAFactory;

    private constructor() {}

    static getInstance(): FIAFactory {
        if (!FIAFactory.instance) {
            FIAFactory.instance = new FIAFactory();
        }
        return FIAFactory.instance;
    }

    /**
     * Crea una nueva FIA con el paradigma especificado
     */
    async crear(config: IFIAConfig): Promise<IFIACompleta> {
        // Validar paradigma
        if (!PARADIGMAS.includes(config.paradigma)) {
            throw new Error(`Paradigma desconocido: ${config.paradigma}`);
        }

        // Crear instancia del paradigma
        const ParadigmaClass = PARADIGMA_REGISTRY[config.paradigma];
        const paradigma = new ParadigmaClass();

        // Inicializar paradigma con config específica
        await paradigma.inicializar(config.paradigmaConfig);

        // Crear FIA y asignar paradigma
        const fia = new FIACompletaBase(config.nombre, config.mundo);
        fia.asignarParadigma(paradigma);

        // Instanciar
        await fia.instanciar();

        return fia;
    }

    /**
     * Crea una FIA específica para razonamiento lógico
     */
    async crearLogica(
        nombre: string,
        programa: string[],
        mundo?: IMundo
    ): Promise<IFIACompleta> {
        return this.crear({
            nombre,
            paradigma: 'logica',
            mundo,
            paradigmaConfig: { programa } as unknown as Record<string, unknown>,
        });
    }

    /**
     * Crea una FIA híbrida con múltiples paradigmas
     */
    async crearHibrido(
        nombre: string,
        paradigmas: FIAParadigma[],
        mundo?: IMundo
    ): Promise<IFIACompleta> {
        const instancias: IParadigma[] = [];
        for (const p of paradigmas) {
            const ParadigmaClass = PARADIGMA_REGISTRY[p];
            const inst = new ParadigmaClass();
            await inst.inicializar();
            instancias.push(inst);
        }

        return this.crear({
            nombre,
            paradigma: 'hibrido',
            mundo,
            paradigmaConfig: { paradigmas: instancias },
        });
    }

    /**
     * Lista paradigmas disponibles
     */
    listarParadigmas(): FIAParadigma[] {
        return [...PARADIGMAS];
    }

    /**
     * Obtiene descripción de un paradigma
     */
    getDescripcion(paradigma: FIAParadigma): string {
        const ParadigmaClass = PARADIGMA_REGISTRY[paradigma];
        const inst = new ParadigmaClass();
        return inst.descripcion;
    }
}

/**
 * Función de conveniencia para crear FIAs
 */
export async function createFIA(config: IFIAConfig): Promise<IFIACompleta> {
    return FIAFactory.getInstance().crear(config);
}
