import { IRowData, IType, ITypeAcceso } from '../../../../../../../as-seed/core/model';
import { IDominio, Dominio } from "../../../../../../mundos/dominio";
import { Estudio } from "../../../../estudio";
import { EXTERNAL_CACHE } from "../../common-kads";
import { FORM_KEY, Formulario } from "../../nivel/formulario";

export class FormularioAM1 extends Formulario {

    dominio: IDominio = new Dominio({});

    constructor(public nombre: string = "AS_AM-01") {
        super();
    };

    rellenar(d: IDominio) {

        console.log("Ejecutando formulario >>", this.nombre);

        // const domain = d.base[EXTERNAL_CACHE]?.domain['Model']['rows'];
        const domain = d.base[EXTERNAL_CACHE]?.domainAuth['Model']['rows'];
        // const models = (this.dominio.base[Estudio.claveDominio] || []);

        if (!domain) {
            console.log("Error, no domain found for auth at", this.dominio, d);
            return;
        }

        const rows = domain as IRowData[];

        const agentes = [];
        const agentesAuth = [];
        const tareas = [];
        for(const row of rows) {

            switch(row.type) {
                case 'Usuario' /* ITypeUsuario */: {
                    agentes.push(row);
                    break;
                }
                case 'Rol' /* ITypeRol */: {
                    tareas.push(row);
                    break;
                }
                case 'UsuarioRol' /* ITypeUsuarioRol */: {
                    agentesAuth.push(row);
                    break;
                }
                case 'Acceso' /* ITypeAcceso */: {
                    tareas.push(row);
                    break;
                }
            }
        }

        this.dominio.base[FORM_KEY] = (this.dominio.base[FORM_KEY] || {});
        this.dominio.base[FORM_KEY]['agentes'] = agentes;
        this.dominio.base[FORM_KEY]['agentesAuth'] = agentesAuth;
        this.dominio.base[FORM_KEY]['tareas'] = tareas;

        //console.log('The agents >>>>>>>>', this.imprimir(), this.dominio.base[FORM_KEY]);

    }

    imprimir(): string {

        const estado = (this.dominio
            .base[Estudio.claveDominio] || [])
            .map(m => m.nombre)
            .join(" - ");

        return `${this.nombre}:[${estado}]`
    }

}