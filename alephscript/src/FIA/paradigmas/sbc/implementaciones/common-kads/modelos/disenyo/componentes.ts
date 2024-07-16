export interface IComponentes {
    comoJSON(): unknown;
}
export class Componentes implements IComponentes {
    comoJSON(): unknown {
        throw new Error("Method not implemented.");
    }
}