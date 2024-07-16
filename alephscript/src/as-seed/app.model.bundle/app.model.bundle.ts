import { ICommonKADSLibrary } from "../core/file-model";
import { ID } from "../core/model";

export type AppDomain = any;

export class AppCommonKADS implements ICommonKADSLibrary {

    forms = [];

}

export interface AppModelBundle {

    id: ID;

    domain: AppDomain[];
    commonKADSforms: AppCommonKADS;
}