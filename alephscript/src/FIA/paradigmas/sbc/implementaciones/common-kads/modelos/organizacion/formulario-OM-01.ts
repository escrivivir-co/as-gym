import { IRow, IRowData, IType } from "../../../../../../../as-seed/core/model";
import { IDominio, Dominio } from "../../../../../../mundos/dominio";
import { Estudio } from "../../../../estudio";
import { EXTERNAL_CACHE } from "../../common-kads";
import { FORM_KEY, Formulario } from "../../nivel/formulario";

export class FormularioOM1 extends Formulario {

    dominio: IDominio = new Dominio({});

    constructor(public nombre: string = "AS_OM-01") {
        super();
    };

    rellenar(d: IDominio) {
        console.log("Ejecutando formulario", this.nombre);

        const domain = d.base[EXTERNAL_CACHE]?.domain['Model']['rows'];
        const domainAuth = d.base[EXTERNAL_CACHE]?.domainAuth['Model']['rows'];
        const models = (this.dominio.base[Estudio.claveDominio] || []);

        if (!domain) {
            console.log("ERROR, empty", d);
            return;
        };

        const types = domain as IRowData[];

        const uniqueMap = new Map<IType, any>();
        types.forEach(r => uniqueMap.set(r.type, ''));

        const printTypes = [];
        const entities = [];
        const acciones = [];
        for(const row of types) {

            switch(row.type) {
                case 'Accion' /* ITypeAcciones */: {
                    acciones.push(row);
                    break;
                }
                default: {
                    entities.push(row);
                }
            }
        }

        this.dominio.base[FORM_KEY] = this.dominio.base[FORM_KEY] || {};
        this.dominio.base[FORM_KEY]['entidades'] = entities;
        this.dominio.base[FORM_KEY]['acciones'] = acciones;
        // console.log('The org', printTypes.join(','));
        // console.log('The org >>>>>>>>', this.imprimir(), this.dominio.base[FORM_KEY]);

    }

    imprimir(): string {

        const estado = (this.dominio
            .base[Estudio.claveDominio] || [])
            .map(m => m.nombre)
            .join(" - ");

        return `${this.nombre}:[${estado}]`
    }

}