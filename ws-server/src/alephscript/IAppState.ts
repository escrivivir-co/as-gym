import { IFase } from "../../../alephscript/src/FIA/paradigmas/sbc/implementaciones/common-kads/IFase";


export interface IAppState {
	index: number;
	name: string;
	fase?: IFase;
}
