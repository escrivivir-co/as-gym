import { Injectable, effect, signal } from '@angular/core';
import { getHash } from '../../../../../ws-server/src/alephscript/IUserDetails';

export class LocalStorage {
	m: any = {};
	getItem = (key: string) => this.m[key];
	setItem = (key: string, value: any) => this.m[key] = value;
}
const localStorage = new LocalStorage();

@Injectable({
	providedIn: 'root'
})
export class UsuarioService {

	constructor() {

		// const nombreLocalStorage = localStorage.getItem("nombre") || getHash("AlephWeB");
		console.log("Constructor")
		let storedS = "<user>"
		if (typeof sessionStorage !== 'undefined') {

			storedS = sessionStorage.getItem("storedS") || storedS
			console.log('sessionStorage is available. User restored: ', storedS);

			if (!storedS) {
				storedS = getHash("Aleph")
				sessionStorage.setItem("storedS", storedS)
				console.log('sessionStorage is set with new logged User', storedS);
			}

		} else {
			console.log('sessionStorage is not available');
		}
		// Fake for DEV this.nombre.set(storedS)
		this.nombre.set("Aleph-333")

		/*if (typeof localStorage !== 'undefined') {
			let storedL = localStorage.getItem("storedL")
			console.log('localStorage is available', storedL);

			if (!storedL) {
				storedL = getHash("TestValue")
				localStorage.setItem("storedL", storedL)
				storedL = localStorage.getItem("storedL")
				console.log('localStorage is >>>>', storedL);
			}

		} else {
			console.log('localStorage is not available');
		}*/

	}

	nombre = signal<string>("");

}


