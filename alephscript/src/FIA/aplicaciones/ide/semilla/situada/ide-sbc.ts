import { agentMessage } from "../../../../agentMessage";
import { IModelo } from "../../../../mundos/modelo";
import { IDE_clave } from "../../../../paradigmas/conexionista/modelos-lenguaje/oai/Trainer_key";
import { FIA_SBC } from "../../../../paradigmas/sbc/fia-sbc";
import { IEstadoT } from "../../../../paradigmas/situada/estado";
import { AlephScriptIDE, AlephScriptIDEImpl } from "../../aleph-script-idle";

export class IDE_SBC extends FIA_SBC {

    async instanciarC(): Promise<IEstadoT<IModelo>> {

        return new Promise(async (resolve, reject) => {

            console.log(agentMessage(this.nombre, "Efectuando sus al mundo"), this.mundo.nombre);

            this.mundo.eferencia.subscribe(async m => {

                const ide: AlephScriptIDE = m.modelo.dominio.base[IDE_clave];

                if (ide && !ide.arrancado) {
                    console.log(agentMessage(this.nombre, "Activando en IDE: Projecto actual: " + ide.imprimir()));

                    m.modelo.dominio.base[IDE_clave].arrancado = true;

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