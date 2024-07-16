import { Guid, Valor, Sensor, DiagnosticoLinea } from "./tipos";

export type Cabecera = any[];

export enum COLUMNAS {
    componente = 0,
    alteracion = 1,
    tipo = 2,
    valores = 3,
    sensores = 4,
    diagnosticos = 5
}

export const CabeceraPC = [
    "componente",

    "alteracion",
    "tipo",

    /* { valores: */ ["autorreparable", "requerir_usuario"] /* } */,

    /* { sensores: */ [{ temperatura: "leve" }, { temperatura: "grave" }] /* } */,

    /* { diagnosticos: */["Diag1", "Diag2"] /* } */
];

export type Linea = {
    Guid: Guid,
    componente: Guid,
    alteracion: Guid,
    tipo: Guid,
    valores: Valor[],
    sensores: Sensor[],
    diagnosticos: DiagnosticoLinea[]
};

export type LineaExterna = any;

export const Linea = [
    "componente1",

    "alteracion1",
    "tipo1",

    { valores: [false, true] },

    {
        sensores: [
            "tendencia decreciente con pérdida del 20% Nmax",
            "tendencia decreciente con pérdida del 80% Nmax"
        ]
    },

    { diagnosticos: [["Diagnostico1", "Diagnostico2"], []] }
];

export type Base = {
    red: {
        ENTIDADES?: any;
        ESTRUCTURALES?: any;
        DESCRIPTIVOS?: any;
        lineas?: Linea[]
    };
    cabecera: Cabecera;
    lineas: LineaExterna[];
}