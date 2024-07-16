import { spawn } from 'child_process';
import readline from 'readline';
import fs from 'fs';
import { RutaDisco } from '../aleph-null';

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

export class PrologServer {
  public prologProcess: any;
  private rl: readline.Interface;
  private loadedFiles: string[] = [];

  private firstGCHIResponse = false;
  private isSecondGCHIResponse = false;
  constructor() {
  }

  static last: string = "";
  openProlog(archivo_pl: RutaDisco) {

    console.log("Create spawn for swipl")
    this.prologProcess = spawn('swipl', [archivo_pl]);
    console.log("Create spawn for swiplm file", archivo_pl)
    this.prologProcess.stdout.setEncoding('utf8');
    this.prologProcess.stdin.setEncoding('utf8');
    this.prologProcess.on('exit', (code) => {
      console.log(`prolog process exited with code ${code}`);
    });

    this.prologProcess.stdin.on('data', (data: string) => {

      console.log('GCHI ON DATA');

    });

    this.prologProcess.stdout.on('data', (data: string) => {

      console.log('GCHI ON DATA');
      if (
        GHCI_PLAY_PROMPTS_END
          .filter(f => data.endsWith(f)).length == 0
        ) {
          PrologServer.last += data;
        console.log(`\n\t prolog output WAIT: [${data}]`);
        return;
      }
      data =  PrologServer.last + data;
      PrologServer.last = "";

      console.log(`\n\t prolog output: [${data.split("\n")}]`);

      if (!this.firstGCHIResponse) {
        this.firstGCHIResponse = true;

        console.log("\n\t Setting dir", ':cd ' + __dirname);
        this.prologProcess.stdin.write(':cd ' + __dirname + '\n');

      } else if (!this.isSecondGCHIResponse) {

        this.isSecondGCHIResponse = true;
        console.log("\n\t Startig loading of prolog libs");
        this.loadprologFiles([':load Factorial', ':load MediaAritmetica', 'factorial 10', 'mediaAritmetica [4]'], () => {
          console.log("Launch my");
          this.prologProcess.stdin.write(':set prompt "' + GHCI_PLAY_PROMPTS[0] + '"\n');
        });
      } else {

        if (GHCI_PLAY_PROMPTS.filter(d => data.indexOf(d) > -1).length > 0) {

          console.log("\n\t Got prolog prompt", "runners queue", this.runners);
          if (this.runners.length > 0) {

            const runner = this.runners.shift();
            console.log("\n\t Launch prolog runner", runner);

            this.prologProcess.stdin.write(":" + runner);
          } else {
            console.log("No action for GHCI response", data);
          }
        }
      }
    });

    this.prologProcess.stdout.on('error', (data) => {
      console.log(`\n\t prolog error: ${data}`);
    });
  }

  loadprologFiles(files: string[], callback: () => void) {

    const filesToLoad = files
      .filter((file) => !this.loadedFiles.includes(file));

    console.log("\t Not Cached prolog libs:", filesToLoad);
    if (filesToLoad.length === 0) {
      callback();
    } else {

      filesToLoad
         .forEach((module) => this.runprologFunction(module, ''));

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
      console.log("\n\t Retrieved cache prolog Libs Headers", this.loadedFiles);
    } catch (error) {
      console.log("\n\t Retrieved cache prolog Libs Headers", error.message);
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
    this.runprologFunction('es_am', '2');

  }

  runners: string[] = [];

  runprologFunction(functionName: string, args: string) {

    const command = `${functionName}(${args}).`;
    console.log("\t Enqueue command", command);
    this.prologProcess.stdout.write(command);
    console.log("\t Wrote to stdout prolog [", command, "]");
  }
}

