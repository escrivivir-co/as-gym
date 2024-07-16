import { IBuildID } from "../as-seed";

export enum API_ERROR_ID {
    NEW = 0,

    OK = 200,
    NOT_FOUND = 404,

    INVALID = 500,
    REJECTED = 404

}
export type Log = {

    build: IBuildID,
    state: API_ERROR_ID,
    error: any

};

export type LogsSnapshot = {
    logs: Log[];
    build: IBuildID;
}