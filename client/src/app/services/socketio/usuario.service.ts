import { Injectable, effect, signal } from '@angular/core';

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
    const nombreLocalStorage = localStorage.getItem("nombre");
    if(nombreLocalStorage) this.nombre.set(nombreLocalStorage);
   }

  nombre = signal<string>("");

  guardarNombreEnLocalStorage = effect(()=> localStorage.setItem("nombre",this.nombre()));
}
