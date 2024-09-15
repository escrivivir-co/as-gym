import { Assistant } from "openai/resources/beta/assistants";
import { IModelo } from "../../mundos/IModelo";


export interface IEstado {

	nombre: string;

	modelo: IModelo;

	comoModelo: () => IModelo;
	deModelo: (m: IModelo) => void;

	transicion(e: IEstado): void;

	onAssistantsReady?: (assistances: Assistant[], selectectName: string) => void;
}
