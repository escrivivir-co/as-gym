import { Ignoto } from "../../../../../../Intencion";
import { IArco } from "./arco";

import { IGrafo } from "./grafo";


// Ver ./vistas/d3/files para formato de archivos

export class Tag {

    innerHTML: string = "";
    children: Tag[] = [];

    constructor(public etiqueta: string) {}

    agregarHijo(hijo: Tag) {

        this.children.push(hijo);

    }

    comoHTML(): string {

        return `<${this.etiqueta}>
                    ${this.innerHTML}
                    ${this.children.map(c => c.comoHTML()).join("\n")}
                </${this.etiqueta}>`;
    }
}

export class ExportadorDeRed {

    procesarNodo(g: IGrafo, padre: Tag, arco: IArco): void {

        // console.log(g.nombre, "hijos", g.arcos.estado.length)
        const li = this.crearLI(padre, `${g.nombre} (${ arco ? arco.etiqueta.estado.valor : ""})`);

        const ul = this.crearUL(""/*`Arcos: ${g.arcos.estado.length}`*/);

        g.arcos.estado.forEach(a => this.procesarNodo(a.destino, ul, a));

        li.agregarHijo(ul);

    }

    crearUL(etiqueta: string): Tag {

        const ul = new Tag("ul");
        const p = this.crearP(etiqueta);
        ul.agregarHijo(p);
        return ul;

    }

    crearLI(ul: Tag, etiqueta: string): Tag {

        const li = new Tag("li");
        const p = this.crearP(etiqueta);
        li.agregarHijo(p);

        ul.agregarHijo(li);

        return li;

    }

    crearP(etiqueta: string): Tag {

        const p = new Tag("p");
        p.innerHTML = etiqueta;

        return p;

    }

    comoHTMLArbol(g: IGrafo): string {

        const ul = this.crearUL(`${g.nombre}. Arcos: ${g.arcos.estado.length}`);

        g.arcos.estado.forEach(a => this.procesarNodo(a.destino, ul, null));

        return ul.comoHTML();
    }

    comoHTML(e: IGrafo[]): string {

        const nodos = e.map(d => {
            return d.arcos.estado.map( a => {
                return `${d.nombre} -> ${a.destino.nombre} [label = "${a.etiqueta.estado.valor || a.etiqueta.estado.nombre}"];`
            }).flat();
        }).flat();

        return nodos.join("\n");

    }

    comoCSV(e: IGrafo[]) {

        const nodos = [
            `source,target,type`
        ].concat(e.map(d => {
            return d.arcos.estado.map( a => {
                return `${d.nombre}, ${a.destino.nombre}, ${a.etiqueta.estado.valor || 'tarea'}`
            }).flat();
        }).flat());

        return nodos.join("\n");

    }

    comoListaJSON(e: IGrafo[]) {

        const nodos = e.map(d => {
            return d.arcos.estado.map( a => {
                return `{ "source": "${d.nombre}", "target": "${a.destino.nombre}", "type": "${a.etiqueta.estado.valor || "tarea"}" }`
            }).flat();
        }).flat();

        return "[" + nodos.join(",\n") + "]";

    }

    comoArbolJSON(e: IGrafo) {

        const p = (g: IGrafo, e: string): Ignoto =>  {

            return {
                name: `(${e}) ${g.nombre}`,
                children: g.arcos.estado.map(a => p(a.destino, a.etiqueta.estado.valor || 'tarea'))
            };
        }

        return p(e, "");

    }
}