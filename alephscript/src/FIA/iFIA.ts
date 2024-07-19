import { Subject } from "rxjs";

import { IAprendize } from "./IAprendize";
import { IPercepto } from "./IPercepto";
import { IDiccionarioI18 } from "./IDiccionarioI18";
import { Aferencia, Eferencia } from "./Intencion";
import { RunStateEnum } from "./mundos/RunStateEnum";
import { IMundo } from "./mundos/IMundo";
import { IRTCache } from "./engine/kernel/IRTCache";


export interface iFIA {

	i18: IDiccionarioI18;

	nombre: string;

	runAsync: boolean;

	objetivos: Aferencia[];

	mundo: IMundo;

	imprimir: () => string;

	configurar?: () => void;

	instanciar(): Promise<string>;

	razona: (mundo: IMundo, i: Aferencia) => Eferencia;

	abstrae: (p: IPercepto) => IAprendize;

	cache: IRTCache;

	runState: RunStateEnum;
	runStateEvent: Subject<RunStateEnum>;

	assistantId?: string;

	bots?: iFIA[];

}
