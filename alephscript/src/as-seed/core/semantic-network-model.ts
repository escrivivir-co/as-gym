import { Grafo, IGrafo } from "../../FIA/paradigmas/simbolica/modelos/formal/sistema/semantica/grafo";
import { ITreeNode } from "../as-importers/tree-loader";
import { IRow } from "./model";

export type ITerminal = any;
export type INoTerminal = any;
export type IProduction = any;
export type IGenesisBlock = any;

export type ISemanticNetworkModel = {
    name: string;
    index: IRow[];
    grafo?: IGrafo;
    bosque?: ITreeNode;
    terminals: ITerminal[];
    non_terminals: INoTerminal[];
    productions: IProduction[];
    genesis: IGenesisBlock[];
};

export class SemanticNetworkModel implements ISemanticNetworkModel {
    name = "default-network";
    index = [];
    grafo = new Grafo();
    bosque = null;
    terminals = [];
    non_terminals = [];
    productions = [];
    genesis = [];
};