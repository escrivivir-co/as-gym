import { Ignoto } from "../../Intencion";
import { Dominio, IDominio } from "../../mundos/dominio";
import * as fs from "fs";
import { IRTCache } from "./IRTCache";

let CACHE_CONTAINER: IDominio;

export class RTCache implements IRTCache {

    dominio: IDominio = new Dominio({});
    archivo: string = '/cache.json';

	cache = false;

    constructor() {
        this.recuperar();
    }

    guardar(clave: string, valor: Ignoto): void {

		console.log("Guardar calve", clave)
        this.dominio.base[clave] = valor;

    }

    leer(clave: string): Ignoto {

        return this.dominio.base[clave];

    }

    leerLista(clave: string): Ignoto[] {

        return this.dominio.base[clave] || [];

    }

    persistir() {

		this.dominio.base = {
			...CACHE_CONTAINER.base,
			...this.dominio.base
		}
		CACHE_CONTAINER.base = this.dominio.base;

        try {
            console.log("escribir datos", Object.keys(this.dominio?.base || {}))
            fs.writeFileSync(__dirname + this.archivo, JSON.stringify(
                { cache : this.dominio.base }, null, "\t"));
            // console.log("Cache escrita en", __dirname + '/cache.json' /*, this.dominio.base*/);
        } catch(ex) {
            console.log("Error al guardar cache", ex)
        }

    }

    persistirRuta() {
        try {
            fs.writeFileSync(this.archivo, JSON.stringify(
                this.dominio.base, null, "\t"));
            // console.log("Cache escrita en", __dirname + '/cache.json' /*, this.dominio.base*/);
        } catch(ex) {
            console.log("Error al guardar cache", ex)
        }


    }

    recuperar() {

		if (CACHE_CONTAINER) {
			this.dominio = CACHE_CONTAINER;
			return
		}

        if (!fs.existsSync(__dirname + this.archivo)) {
            this.persistir();
        }
        const data: any = fs.readFileSync(__dirname + this.archivo);

        this.dominio.base = JSON.parse(data || {})?.cache || {};

        console.log("Leida cache de: ", __dirname + '/cache.json');

		CACHE_CONTAINER = this.dominio;

    }

    recuperRuta(archivo: string) {

        const data: any = fs.readFileSync(archivo);

        return JSON.parse(data);

    }

    recuperar2() {

        if (!fs.existsSync(this.archivo)) {
            this.dominio = { base: {} };
            console.log("inicializando el archvivo", this.archivo)
            this.persistirRuta();
        }
        const data: any = fs.readFileSync(this.archivo);

        this.dominio.base = JSON.parse(data || {}) || {};

        // console.log("Leida cache de: ", __dirname + '/cache.json');

    }

}