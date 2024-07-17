import { AgregarBloque } from "./aplicaciones/ide/cadena-bloques";
import { IModelo } from "./mundos/IModelo";
import { IDE_clave } from "./paradigmas/conexionista/modelos-lenguaje/oai/Trainer_key";

const CKCACHE_Clave = "CJKCACHE";

export function agentMessageCache(m: IModelo) {
    console.log(m.dominio.base[IDE_clave].cache.dominio.base[CKCACHE_Clave]);
}
export function agentMessage(id: string, message: string, nivel?: string) {

    AgregarBloque(nivel || id, {
        estado: message,
        fecha:new Date()
    });
    return `${id}> ${message}`;
}
