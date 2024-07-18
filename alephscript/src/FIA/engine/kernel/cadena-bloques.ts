
import { ACTIVAR_GUARDADO_LOGS, SET_EXECUTION_PROCESS } from "../../../runCONFIG";
import { RTCache } from "./rt-cache";
import { Runtime } from "./runtime";

export interface Bloque {

	id?: string;
	estado?: Bloque | any;
    fecha?: Date;

}

export const Bloque: Bloque = {
    id: "genesis",
    estado: {},
    fecha: new Date()
}

const c = new RTCache();
export function AgregarBloque(id: string, estado: Bloque | any, fecha?: Date) {

    let direccion = Bloque.estado[id];

    direccion = direccion || [];

    direccion.push(estado);

    Bloque.estado[id] = direccion;

	if (ACTIVAR_GUARDADO_LOGS) {
		c.guardar("genesis", Bloque);
		c.persistir();
	}

	if (SET_EXECUTION_PROCESS)
		Runtime.client?.room("SET_EXECUTION_PROCESS", Bloque);

}
