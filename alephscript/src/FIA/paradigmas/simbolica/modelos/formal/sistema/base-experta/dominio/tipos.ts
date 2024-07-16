export type Guid = string;
export type GuidSensor = Guid;
export type GuidExterno = string;
export type FuncionCriterio = (...args) => boolean;

export type CriteriosSensor = { guidSensor: GuidSensor, guidRegulador: Guid };
export type Sensor = any;
export type Valor = Guid;
export type Paso = Guid;
export type Diagnostico = Guid;
export type DiagnosticoLinea = Paso[];

type Telemetria = number;
export type Lectura = Telemetria;
export type Aferencia = { GuidSensor: GuidSensor, Lectura: Lectura };