import { iFIA } from "../../iFIA";
import { IMundo } from "../../mundos/IMundo";
import { RunStateEnum } from "../../mundos/RunStateEnum";



export interface IMenuState {
	index: number;
	name: string;
	state: RunStateEnum;
	mundo: Partial<IMundo>;
	bots: iFIA[];
}
