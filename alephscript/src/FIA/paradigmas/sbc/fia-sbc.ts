import { GenesisBlock } from "../../genesis-block";
import { iFIA } from "../../iFIA";
import { agentMessage } from "../../agentMessage";
import { AS_SBC_I18 } from "./as-sbc-i18";
import { SBC_CK } from "./implementaciones/common-kads/fia-sbc-ck";
import { CKCACHE_Clave } from "./implementaciones/common-kads/common-kads";
import { IModelo } from "../../mundos/IModelo";
import { IEstadoT } from "../situada/IEstadoT";
import { RTCache } from "../../engine/kernel/rt-cache";
import { IMundo } from "../../mundos/IMundo";

export interface FIA_SBC extends iFIA {

    instanciarE(m: IMundo): Promise<IEstadoT<IModelo>>;

}

export class FIA_SBC extends GenesisBlock implements iFIA {

    i18 = AS_SBC_I18;

    runAsync = true;

    nombre = this.i18.NOMBRE;

    async instanciarE(m: IMundo): Promise<IEstadoT<IModelo>> {

        return new Promise(async (resolve, reject) => {

            console.log(agentMessage(this.nombre, this.i18.CABECERA));
            // try {
                const ck = new SBC_CK();

                // TODO const as = new Asistentizador(ck.commonkads);
                // TODO as.examinarClase();

                const ch = new RTCache();
                let c = ch.leer(CKCACHE_Clave);

                if (c && c.fase !== "") {
                    resolve(c);
                    console.log(agentMessage(this.nombre, "Cacheado! " + this.i18.PIE));
                    return;
                }

                const resultado = await ck.instanciar(m);

				try {
					this.cache.guardar(CKCACHE_Clave, resultado?.comoModelo().dominio.base[CKCACHE_Clave]);
					this.cache.persistir();
				} catch(ex) {
					console.log(agentMessage(this.nombre, "No pude guardar la cache de la transición", ex))
				}

                console.log(agentMessage(this.nombre, this.i18.PIE));

                resolve(resultado)

            //} catch(ex) {

            //    reject(ex.message);

            //}


        });

    }
}