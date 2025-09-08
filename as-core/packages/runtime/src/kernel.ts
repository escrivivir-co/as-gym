/**
 * Kernel components for the runtime
 */

export class Kernel {
  private initialized = false;

  initialize(): void {
    if (this.initialized) return;
    
    console.log('Kernel initialized');
    this.initialized = true;
  }

  shutdown(): void {
    console.log('Kernel shutdown');
    this.initialized = false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
