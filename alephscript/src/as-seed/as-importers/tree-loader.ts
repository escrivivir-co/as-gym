import { IBaseConocimiento } from "../../FIA/mundos/base-conocimiento";
import { Grafo } from "../../FIA/paradigmas/simbolica/modelos/formal/sistema/semantica/grafo";
import { IFilePath } from "../core/file-model";
import { IModel, IRow, Model } from '../core/model';
import { ISemanticNetworkModel } from "../core/semantic-network-model";
import { StructuredDataLoader } from "./loader";

export class TreeModel extends Model implements IModel  {

    grafo: Grafo[];
    indice: IRow[];

}

export interface ITreeNode extends IBaseConocimiento {

    pk: string;
    data: any;
    hijos: ITreeNode[];

}

export class TreeLoader extends StructuredDataLoader {

    model = new TreeModel();

    import(Tree_file: IFilePath) {
        super.import(Tree_file);

        this.network.bosque = {
            pk: "Base",
            data: {},
            hijos: []
        }

        console.log("-----------=============--------------------")
        console.log("-------------------------------")
        console.log("-------------------------------")

        console.log(this.network.index);

        const tree: ITreeNode = this.network.bosque;

        this.network.index.forEach(r => {

            if (r.type == "Accion") console.log("The path", r)
            // console.log("The current state", this.network.bosque)
            if (r.fk) {
                r.fk += r.pk + "/";
            }
            const rs = r.fk ? r.fk?.split("/").reverse() || [] : r.pk.split("/");
            this.recursiveRow(r.type, rs, r.data, tree);
            // console.log("The final state", this.network.bosque)
            // console.log("Loop for row <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")

        })

        console.log("Procesado", this.network.bosque)
        console.log("-------------------------------")
        console.log("-------------------------------")
        console.log("-------------===============------------------")

    }

    export(): ISemanticNetworkModel {
        return super.export();
    }

    recursiveRow(rpk: string, rfk: string[], data: any, tree: ITreeNode): ITreeNode {

        const segment = rfk.pop();

        if (rpk == "Accion") {
            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
        }

        if (!segment) {
            if (rpk == "Accion") {
                console.log("SALIR", tree)
            }
            return tree;
        }

        const child = tree.hijos.find(h => {
            // console.log("comparanddo", h.pk, segment)
            return h.pk == segment
        });
        if (child) {
            // console.log("encontrado", segment)
            return this.recursiveRow(rpk, rfk, data, child);
        } else {
            const nuevo = {
                pk: segment,
                data,
                hijos: []
            }

            if (rpk == "Accion") {
                console.log("NUEVO HIJO", nuevo, tree)
            }
            tree.hijos.push(nuevo);
            return this.recursiveRow(rpk, rfk, data, nuevo);
        }

    }

}
