import * as http from 'http';
import { ThreadType } from '@fia/core';
import { i18, systemMessage } from '@fia/i18n';

/**
 * Thread Launcher - Main application for launching different FIA threads
 */
export class ThreadLauncher {
  private host = 'localhost';
  private port = 8000;
  private server?: http.Server;

  constructor(port?: number) {
    if (port) this.port = port;
  }

  private createRequestListener() {
    return (req: http.IncomingMessage, res: http.ServerResponse) => {
      res.writeHead(200);
      res.end("FIA Framework - Thread Launcher");
    };
  }

  private setupErrorHandler() {
    this.server?.on('error', (e: Error) => {
      console.log(systemMessage(`Thread Handle Error: ${e.message}`));
    });
  }

  async launchThread(threadType: ThreadType): Promise<void> {
    console.log(systemMessage(i18.SISTEMA.STARTING_LABEL));

    switch (threadType) {
      case 'runtime':
        await this.launchRuntimeThread();
        break;
      case 'sb':
        await this.launchSearchThread();
        break;
      case 'aa':
        await this.launchMachineLearningThread();
        break;
      case 'grammar':
        await this.launchGrammarThread();
        break;
      case 'ops':
        await this.launchDevOpsThread();
        break;
      default:
        console.log(systemMessage(`Unknown thread type: ${threadType}`));
    }
  }

  private async launchRuntimeThread(): Promise<void> {
    const { Runtime } = await import('@fia/runtime');
    const rt = new Runtime();
    rt.start();
    await rt.demo();
  }

  private async launchSearchThread(): Promise<void> {
    const { EscaladaMaximoGradiente } = await import('@fia/search-algorithms');
    const eg = new EscaladaMaximoGradiente();
    eg.test();
  }

  private async launchMachineLearningThread(): Promise<void> {
    const { CandidateElimination } = await import('@fia/machine-learning');
    const candidateElimination = new CandidateElimination();
    candidateElimination.test();
    candidateElimination.test2();
  }

  private async launchGrammarThread(): Promise<void> {
    const { automataAritmeticoX } = await import('@fia/grammars');
    automataAritmeticoX.iniciar2();
  }

  private async launchDevOpsThread(): Promise<void> {
    const { DevOpsFileManager, OpenAIAssistantManager } = await import('@fia/devops');
    
    const eg = new DevOpsFileManager();
    eg.test();

    const a = new OpenAIAssistantManager();
    await a.init();
    await a.setupAssistant();
    await a.requestSample();
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = http.createServer(this.createRequestListener());
      this.setupErrorHandler();
      
      this.server.listen(this.port, () => {
        console.log(systemMessage(`Server running at http://${this.host}:${this.port}/`));
        resolve();
      });
    });
  }

  stop(): void {
    this.server?.close();
  }
}

// CLI interface
if (require.main === module) {
  const launcher = new ThreadLauncher();
  const threadType = process.argv[2] as ThreadType || 'runtime';
  
  launcher.start().then(() => {
    return launcher.launchThread(threadType);
  });
}
