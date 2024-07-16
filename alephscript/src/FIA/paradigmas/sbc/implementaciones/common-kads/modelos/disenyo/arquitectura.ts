export interface IArquitectura {
    comoJSON(): unknown;
}
export class Arquitectura implements IArquitectura {
    comoJSON(): unknown {
        return this.comoJSON
    }
}
