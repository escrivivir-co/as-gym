import path from "path";
import { AlephScriptBoilerplate } from "../../../../../../as-seed/guest/main";
import { CONST_CORPUS_PATH } from "../../../../../aplicaciones/ide/aleph-script-idle";
import { RTCache } from "../../../../../engine/kernel/rt-cache";
import { Dominio, IDominio } from "../../../../../mundos/dominio";
import { Modelo } from "../../../../../mundos/modelo";
import { IInferencia } from "../../../../simbolica/inferencia";
import { Arco } from "../../../../simbolica/modelos/formal/sistema/semantica/arco";
import { Grafo } from "../../../../simbolica/modelos/formal/sistema/semantica/grafo";
import { Estudio } from "../../../estudio";
import { AS_COMMON_KADS_I18 } from "../as-common-kads-i18";
import { FormularioAM1 } from "../modelos/agentes/formulario-AM-01";
import { FormularioOM1 } from "../modelos/organizacion/formulario-OM-01";
import { ITarea } from "../modelos/tareas/tarea";
import { FORM_KEY, IFormulario } from "./formulario";
import { IFormularioOTA1 } from "./nivel-contextual";

/**
 * Conceptual Modeling Language
 */
export interface ICML {

    modelar(f: IFormularioOTA1): ICMLModelo;

}

export interface ICMLModelo {

    dominio: IDominio;
    inferencias: IInferencia[];
    tareas: ITarea[];

    imprimir(): string;
}

export class CML implements ICML {

    constructor() {}

    modelar(f: IFormularioOTA1): ICMLModelo {

        const modelo = new Modelo();
        const dominio = new Dominio(modelo);
        dominio.base["Common.Kads.cml"] = {};

        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", f.dominio.base[Estudio.claveDominio])
        const forms = f.dominio.base[Estudio.claveDominio] as IFormulario[];
        const OM1 = forms.find(f => f.nombre == new FormularioOM1().nombre);
        const AM1 = forms.find(f => f.nombre == new FormularioAM1().nombre);

        const grafo = new Grafo();

        grafo.nombre = "projecto";

        const arco = new Arco();

        const story1 = new Grafo();
        grafo.nombre = "Story1" + "";
        arco.destino = story1;

        grafo.arcos.estado.push(new Arco())

        console.log("The OM1", OM1.dominio.base[FORM_KEY], OM1.dominio.base[FORM_KEY].entidades[1]);
        console.log("The OM1", OM1.dominio.base[FORM_KEY].entidades);
        console.log("The OM1", OM1.dominio.base[FORM_KEY].acciones);
        console.log("The AM1", AM1.dominio.base[FORM_KEY].agentes);
        console.log("The AM1", AM1.dominio.base[FORM_KEY].agentesAuth);
        console.log("The AM1", AM1.dominio.base[FORM_KEY].tareas);
        const inferencias = [];
        const tareas = [];

        const c = new RTCache();

        c.archivo = CONST_CORPUS_PATH + 'corpus/sbc.kads.ota_1.json';

        const otaForms = (f.dominio.base[Estudio.claveDominio] as IFormulario[]).slice(1);

        const exportForms = otaForms.map(form => {
            const data = {
                name: form.nombre,
                //snapshot: form.imprimir(),
                data: form.dominio.base[FORM_KEY]
            };
            return data;
        });

        c.dominio.base = exportForms;
        c.persistirRuta();

        const as = new AlephScriptBoilerplate();
        as.init();
        c.archivo = path.join(as.app.baseFolder, as.app.appFolder, "OTA_0001.aleph");
        c.persistirRuta();

        return {
            dominio,
            inferencias,
            tareas,
            imprimir: () => AS_COMMON_KADS_I18.COMMON_KADS.CK.FASES.CONCEPTUAL.CML
        }
    }

}