import { spawn } from 'child_process';
import readline from 'readline';
import fs from 'fs';

export const GHCI_PLAY_PROMPTS = [
  "Prelude",
  "module loaded"
]

export const GHCI_PLAY_PROMPTS_END = [
  "Prelude",
  "> ",
  ",",
  ":? for help,",
]

export class HaskellServer {
  public haskellProcess: any;
  private rl: readline.Interface;
  private loadedFiles: string[] = [];

  private firstGCHIResponse = false;
  private isSecondGCHIResponse = false;
  constructor() {
    // Enable for multisesion: this.loadSavedFiles();
    this.openHaskell();
  }

  static last: string = "";
  openHaskell() {
    this.haskellProcess = spawn('ghci', ['-XExtendedDefaultRules']);
    this.haskellProcess.stdout.setEncoding('utf8');
    this.haskellProcess.stdin.setEncoding('utf8');
    this.haskellProcess.on('exit', (code) => {
      console.log(`Haskell process exited with code ${code}`);
    });

    this.haskellProcess.stdout.on('data', (data: string) => {

      console.log('GCHI ON DATA');
      if (
        GHCI_PLAY_PROMPTS_END
          .filter(f => data.endsWith(f)).length == 0
        ) {
        HaskellServer.last += data;
        console.log(`\n\t Haskell output WAIT: [${data}]`);
        return;
      }
      data =  HaskellServer.last + data;
      HaskellServer.last = "";

      console.log(`\n\t Haskell output: [${data.split("\n")}]`);

      if (!this.firstGCHIResponse) {
        this.firstGCHIResponse = true;

        console.log("\n\t Setting dir", ':cd ' + __dirname);
        this.haskellProcess.stdin.write(':cd ' + __dirname + '\n');

      } else if (!this.isSecondGCHIResponse) {

        this.isSecondGCHIResponse = true;
        console.log("\n\t Startig loading of haskell libs");
        this.loadHaskellFiles([':load Factorial', ':load MediaAritmetica', 'factorial 10', 'mediaAritmetica [4]'], () => {
          console.log("Launch my");
          this.haskellProcess.stdin.write(':set prompt "' + GHCI_PLAY_PROMPTS[0] + '"\n');
        });
      } else {

        if (GHCI_PLAY_PROMPTS.filter(d => data.indexOf(d) > -1).length > 0) {

          console.log("\n\t Got Haskell prompt", "runners queue", this.runners);
          if (this.runners.length > 0) {

            const runner = this.runners.shift();
            console.log("\n\t Launch Haskell runner", runner);

            this.haskellProcess.stdin.write(":" + runner);
          } else {
            console.log("No action for GHCI response", data);
          }
        }
      }
    });

    this.haskellProcess.stdout.on('error', (data) => {
      console.log(`\n\t Haskell error: ${data}`);
    });
  }

  loadHaskellFiles(files: string[], callback: () => void) {

    const filesToLoad = files
      .filter((file) => !this.loadedFiles.includes(file));

    console.log("\t Not Cached Haskell libs:", filesToLoad);
    if (filesToLoad.length === 0) {
      callback();
    } else {

      filesToLoad
         .forEach((module) => this.runHaskellFunction(module, ''));

      console.log('Store loaded libraries');
      this.loadedFiles.push(...filesToLoad);
      console.log('Store loaded libraries DISK');
      this.saveLoadedFiles();
      console.log('Store loaded libraries END');
      callback();

    }
  }

  saveLoadedFiles() {
    // console.log("Updading loadedFiles.json", this.loadedFiles)
    const data = JSON.stringify(this.loadedFiles, null, "\t");
    fs.writeFileSync(__dirname + '/loadedFiles.json', data);
    // console.log("Written to", __dirname + '/loadedFiles.json', data)
  }

  loadSavedFiles() {
    try {
      const data = fs.readFileSync(__dirname + '/loadedFiles.json', 'utf8');
      this.loadedFiles = JSON.parse(data);
      console.log("\n\t Retrieved cache Haskell Libs Headers", this.loadedFiles);
    } catch (error) {
      console.log("\n\t Retrieved cache Haskell Libs Headers", error.message);
      // El archivo no existe o no se puede leer, se asume que no se han cargado archivos previamente.
      this.loadedFiles = [];
    }
  }

  startServer() {

    console.log("Starting menu");
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.rl.question(
      '\n Seleccione una funcionalidad:\n1. Factorial de un entero\n2. Media aritmética de una secuencia\n',
      (choice) => {
        if (choice === '1') {
          this.rl.question('Introduce un número entero para calcular su factorial: ', (number) => {
            this.runHaskellFunction('factorial', number);
          });
        } else if (choice === '2') {
          this.rl.question('Introduce una secuencia de números separados por espacios: ', (sequence) => {
            this.runHaskellFunction('mediaAritmetica', sequence);
          });
        } else {
          console.log('Selección no válida.');
          this.rl.close();
          this.startServer();
        }
      }
    );
  }

  runners: string[] = [];
  runHaskellFunction(functionName: string, args: string) {

    const command = functionName + '\n';
    console.log("\t Enqueue command", command);

    this.runners.push(command);

  }
}

