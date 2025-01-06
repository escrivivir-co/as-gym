import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ReplayBuffer {
  buffer: { state: number[], action: number, reward: number, nextState: number[], done: boolean }[] = [];
  bufferSize = 1000;
  batchSize = 32;

  constructor() {}

  // Añade una transición (experiencia) al buffer
  addExperience(state: number[], action: number, reward: number, nextState: number[], done: boolean): void {
    if (this.buffer.length > this.bufferSize) {
      this.buffer.shift(); // Elimina la experiencia más antigua si superamos el tamaño máximo del buffer
    }
    this.buffer.push({ state, action, reward, nextState, done });
  }

  // Obtiene un lote aleatorio de experiencias del buffer
  sampleBatch(): { state: number[], action: number, reward: number, nextState: number[], done: boolean }[] {
    const sample = [];
    for (let i = 0; i < this.batchSize; i++) {
      sample.push(this.buffer[Math.floor(Math.random() * this.buffer.length)]);
    }
    return sample;
  }
}
