import { RTCache } from "../../../engine/kernel/rt-cache";
import { Runtime } from "../../../engine/kernel/runtime";

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

    c.guardar("genesis", Bloque);
    c.persistir();

	Runtime.client.room("SET_EXECUTION_PROCESS", Bloque);

}
