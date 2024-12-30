import { Socket } from "socket.io-client";


export type INamespaceDetails = {
	name: string;
	socketsCount: number;
	sockets: Partial<Socket>[];
};
