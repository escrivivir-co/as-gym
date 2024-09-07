import { Subject, Subscription, Observable } from "rxjs";
import { IDiccionarioI18 } from "../IDiccionarioI18";
import { IModelo } from "./IModelo";
import { RunStateEnum } from "./RunStateEnum";


export interface IMundo {

	i18: IDiccionarioI18;

	nombre: string;
	modelo: IModelo;

	pulsoVital: NodeJS.Timeout;

	instanciar(): Promise<IModelo>;

	vivo(): boolean;

	pulso: () => void;

	ciclo: () => Promise<IModelo>;

	jornada(vivir: Function, morir: Function): void;

	eferencia: Subject<IMundo>;

	aferencias: Subscription[];

	agregarAferencia(o: Observable<IMundo>): void;

	alAcabar(nombre: string): Promise<IModelo>;

	destructor(): void;

	elMundoAcabara: Observable<IMundo>;

	runState: RunStateEnum;
	runStateEvent: Observable<RunStateEnum>;

	renderer?: string;
}
