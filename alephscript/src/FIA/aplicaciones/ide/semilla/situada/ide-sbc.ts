import { agentMessage } from "../../../../agentMessage";
import { RTCache } from "../../../../engine/kernel/rt-cache";
import { IModelo } from "../../../../mundos/IModelo";
import { IDE_clave } from "../../../../paradigmas/conexionista/modelos-lenguaje/oai/Trainer_key";
import { FIA_SBC } from "../../../../paradigmas/sbc/fia-sbc";
import { CKCACHE_Clave } from "../../../../paradigmas/sbc/implementaciones/common-kads/common-kads";
import { IEstadoT } from "../../../../paradigmas/situada/IEstadoT";
import { AlephScriptIDE } from "../../aleph-script-idle";

export class IDE_SBC extends FIA_SBC {

    async instanciarC(): Promise<IEstadoT<IModelo>> {

        return new Promise(async (resolve, reject) => {

            console.log(agentMessage(this.nombre, "Unirse a: " + this.mundo.nombre), this.mundo.nombre);

            this.mundo.eferencia.subscribe(async m => {

                const ide: AlephScriptIDE = m.modelo.dominio.base[IDE_clave];

                if (ide && !ide.arrancado) {
                    console.log(agentMessage(this.nombre, "Arrancar IDE: " + ide.imprimir()));

                    m.modelo.dominio.base[IDE_clave].arrancado = true;

					// BORRAR LA CACHE comentar PARA MANTENER
					const c = new RTCache();
					c.guardar(CKCACHE_Clave, null);
					c.persistir();
					// ------------

                    const resultados = Promise.allSettled(
                        [
                            ide.motor(),
                            super.instanciarE(this.mundo)
                        ]
                    );

                    const em = resultados[1];
                    ide.arrancado = true;

                    resolve(em);
                } else {
                    // console.log("THE", m.modelo.dominio.base, "KE[", m.modelo.dominio.base[IDE_clave] + "]")
                }

            });
        });

    }
}