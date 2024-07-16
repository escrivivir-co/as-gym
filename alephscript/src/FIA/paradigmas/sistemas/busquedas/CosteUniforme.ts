import { FuncSucesores, PrimeroEnAnchura } from "./PrimeroEnAnchura";


export class CosteUniforme extends PrimeroEnAnchura {

    static sucesores: FuncSucesores = (arcos) => arcos.sort((a, b) => a.coste < b.coste ? -1 : 1);

}
