import { Ignoto } from "../../Intencion";
import { IDominio } from "../../mundos/dominio";


export interface IRTCache {

	dominio: IDominio;
	archivo: string;

	cache: boolean;

    guardar(clave: string, valor: Ignoto): void ;

    leer(clave: string): Ignoto;

    leerLista(clave: string): Ignoto[];

    persistir(): void;

    persistirRuta(): void;

    recuperar(): void;

    recuperRuta(archivo: string): void;

    recuperar2(): void;

}
