export const CabeceraPC = [
    "componente",

    "alteracion",
    "tipo",

    /* { valores: */ ["autorreparable", "requerir_usuario"] /* } */,

    /* { sensores: */ [{ temperatura: "leve" }, { temperatura: "grave" }] /* } */,

    /* { diagnosticos: */["Diag1", "Diag2"] /* } */
];

export const PC1 = [

    "CPU",

    "Temperatura fuera de rango",
    "F01-sistema-ventilacion",

    [true, true],

    [
        "tendencia decreciente con pérdida del 20% Nmax",
        "tendencia decreciente con pérdida del 80% Nmax"
    ],

    [
        [ "F01-apagar-ventilador", "F01-iniciar-procesos-mantenimiento"], 
        []
    ]

]

export const PC2 = [

    "CPU",

    "Temperatura fuera de rango",
    "F02-sistema-ventilacion",

    [true, false],

    [
        "tendencia creciente con ganancia del 20% Nmin",
        "tendencia creciente con ganancia del 80% Nmin"
    ],

    [["F01-encender-ventilador"], ["F01-apagar-procesos-mantenimiento"],]

]