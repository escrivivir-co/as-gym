import { GenesisBlock, IAprendize, IDiccionarioI18, IPercepto, iFIA } from "../../genesis-block";
import { i18 } from "../../i18/aleph-script-i18";
import { IMundo } from "../../mundos/mundo";
import { IACientifica } from "../../paradigmas/cientifica/paradigma";
import { FIAConexionista } from "../../paradigmas/conexionista/fia-conexionista";
import { FIAHibrida } from "../../paradigmas/hibrido/fia-hibrida";
import { FIASimbolica } from "../../paradigmas/simbolica/fia-simbolica";
import { FIASituada } from "../../paradigmas/situada/fia-situada";
import { agentMessage } from "../../agentMessage";
import { IApp } from "./iapp";

export class App extends FIAHibrida implements IApp {
    dummy: GenesisBlock;

    i18 = i18.APPS;
    nombre = i18.APPS.ME_LABEL;

    runAsync = true;

    objetivos: any[];
    mundo: IMundo;

    fias = [];
    debil: GenesisBlock;
    fuerte: GenesisBlock;
    situada: FIASituada;
    simbolica: FIASimbolica;
    conexionista: FIAConexionista;

    imprimir: () => string;

    async instanciar(): Promise<string> {

        console.log(agentMessage(this.nombre, i18.SITUADA.SIMULATION_START));

        /**
         *
         */
        this.debil = IACientifica.fiaDebil;
        this.fuerte = IACientifica.fiaFuerte;
        this.situada = new FIASituada();
        this.simbolica = new FIASimbolica();
        this.conexionista = new FIAConexionista();

        await this.situada.instanciar();

        console.log(
            agentMessage(this.nombre,
            `${this.i18.BODY}:${""}`)
        );

        return `${i18.SITUADA.SIMULATION_END}`;
    }

    razona: (mundo: IMundo, i: any) => any;

    abstrae: (p: IPercepto) => IAprendize;



}