/**
 * Runtime interfaces (duplicated to avoid circular deps)
 */
interface IRuntime {
  start(): void;
  stop(): void;
  demo?(): Promise<void>;
}

/**
 * Main runtime engine for FIA components
 */
export class Runtime implements IRuntime {
  private isRunning = false;

  start(): void {
    if (this.isRunning) {
      console.log('Runtime is already running');
      return;
    }
    
    this.isRunning = true;
    console.log('FIA Runtime started');
  }

  stop(): void {
    this.isRunning = false;
    console.log('FIA Runtime stopped');
  }

  async demo(): Promise<void> {
    console.log('Running FIA Runtime demo...');
    // Demo implementation would go here
  }

  isActive(): boolean {
    return this.isRunning;
  }
}

export * from './kernel';
export * from './base';
