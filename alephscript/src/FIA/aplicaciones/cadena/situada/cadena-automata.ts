import { i18 } from "../../../i18/aleph-script-i18";
import { Automata } from "../../../paradigmas/situada/automata";
import { CadenaEstado } from "./cadena-estado";
import { TOPE_POSICION } from "./cadena-fia-situada";

export class CadenaAutomata<CadenaEstados> extends Automata<CadenaEstados> {

    nombre = i18.APPS.CADENA.SITUADA.AUTOMATA.NOMBRE;

    configurar(): void {

        this.mundo.modelo.pulso = 1000;
        this.mundo.modelo.muerte = TOPE_POSICION;

        this.estado = new CadenaEstado<CadenaEstados>(this.mundo.modelo);

        this.nombre = i18.APPS.CADENA.SITUADA.AUTOMATA.NOMBRE;

        super.configurar();

    }

}