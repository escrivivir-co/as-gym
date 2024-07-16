import { Automata } from "../../../../paradigmas/situada/automata";
import { IDEEstado, IDEEstados } from "./ide-estado";
import { IDE_SITUADA_i18 } from "./ide-situada-i18";

export class IDEAutomata<IDEEstados> extends Automata<IDEEstados> {

    nombre = IDE_SITUADA_i18.SITUADA.NOMBRE;

    configurar(): void {

        super.configurar();

        this.estado = new IDEEstado<IDEEstados>(this.mundo.modelo);

    }

}