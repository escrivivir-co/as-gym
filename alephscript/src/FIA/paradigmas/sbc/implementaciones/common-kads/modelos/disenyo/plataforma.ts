export interface IPlataforma {
    comoJSON(): unknown;
}
export class Plataforma implements IPlataforma {
    comoJSON(): unknown {
        throw new Error("Method not implemented.");
    }
}