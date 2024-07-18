
import { ACTIVAR_GUARDADO_LOGS, SET_EXECUTION_PROCESS } from "../runCONFIG";
import { AgregarBloque } from "./engine/kernel/cadena-bloques";
import { IModelo } from "./mundos/IModelo";
import { IDE_clave } from "./paradigmas/conexionista/modelos-lenguaje/oai/Trainer_key";

const CKCACHE_Clave = "CJKCACHE";

export function agentMessageCache(m: IModelo) {
    console.log(m.dominio.base[IDE_clave].cache.dominio.base[CKCACHE_Clave]);
}
export function agentMessage(id: string, message: string, nivel?: string) {

	if (ACTIVAR_GUARDADO_LOGS || SET_EXECUTION_PROCESS) {
		AgregarBloque(nivel || id, {
			estado: message,
			fecha:new Date()
		});
	}

    return `${id}> ${message}`;
}
