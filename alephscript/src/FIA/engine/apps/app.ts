import { GenesisBlock } from "../../genesis-block";
import { IAprendize } from "../../IAprendize";
import { IPercepto } from "../../IPercepto";
import { IDiccionarioI18 } from "../../IDiccionarioI18";
import { iFIA } from "../../iFIA";
import { i18 } from "../../i18/aleph-script-i18";
import { IMundo } from "../../mundos/IMundo";
import { IACientifica } from "../../paradigmas/cientifica/paradigma";
import { FIAConexionista } from "../../paradigmas/conexionista/fia-conexionista";
import { FIAHibrida } from "../../paradigmas/hibrido/fia-hibrida";
import { FIASimbolica } from "../../paradigmas/simbolica/fia-simbolica";
import { FIASituada, IFIASituada } from "../../paradigmas/situada/fia-situada";
import { agentMessage } from "../../agentMessage";
import { IApp } from "./iapp";
import { AlephScriptClient } from "./socketio/client";
import { getHash, IUserDetails } from "../../../../../ws-server/src/alephscript/IUserDetails";

export class App extends FIAHibrida implements IApp {

	dontConnectToSocket: boolean;
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

	bots = [];

    imprimir: () => string;
	spider;

	constructor() {

		super()
	}

	getRoomName() {
		return this.mundo.nombre;
	}

	conectarEntorno() {

		this.spider = new AlephScriptClient(this.nombre)
		this.spider.initTriggersDefinition.push(() => {

			this.spider.io.emit("CLIENT_REGISTER", { usuario: this.nombre, sesion: getHash("xS")} as IUserDetails);
			this.spider.io.emit("CLIENT_SUSCRIBE", { room:   this.getRoomName()});
			this.spider.room("MAKE_MASTER", { features: this.bots.map(b => b.nombre)}, this.getRoomName());


		})

	}

	configurar?: () => void;
	assistantId?: string;

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