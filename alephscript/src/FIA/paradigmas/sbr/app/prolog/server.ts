import * as swipl from 'swipl-stdio';

import readline from 'readline';
import fs from 'fs';
import { RutaDisco } from '../aleph-null';
import { spawn } from 'child_process';
import path from 'path';

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
  public PrologProcess: any;
  private rl: readline.Interface;
  private loadedFiles: string[] = [];

  private firstGCHIResponse = false;
  private isSecondGCHIResponse = false;
  engine: swipl.Engine;
  constructor() {
  }

  static last: string = "";

  openProlog(rutaArchivoPl: RutaDisco) {
    const top = path.join(__dirname, 'top.pl');
    const sw = spawn('swipl', [
      '-f', top,
      '--no-tty',
      '-q',
      '-t', 'loop',
      '--nodebug',
      '-O'
    ]);
    this.engine = new swipl.Engine(sw);

    console.log("Then engine2 doing on!", top)
    console.log("Engine ready", this.engine.state.state);
  }

  loadPrologFiles(files: string[], callback: () => void) {

    const filesToLoad = files
      .filter((file) => !this.loadedFiles.includes(file));

    console.log("\t Not Cached Prolog libs:", filesToLoad);
    if (filesToLoad.length === 0) {
      callback();
    } else {

      filesToLoad
         .forEach((module) => this.runPrologFunction(module, ''));

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
      console.log("\n\t Retrieved cache Prolog Libs Headers", this.loadedFiles);
    } catch (error) {
      console.log("\n\t Retrieved cache Prolog Libs Headers", error.message);
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
            this.runPrologFunction('factorial', number);
          });
        } else if (choice === '2') {
          this.rl.question('Introduce una secuencia de números separados por espacios: ', (sequence) => {
            this.runPrologFunction('mediaAritmetica', sequence);
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

  runPrologFunction(functionName: string, args: string) {

    (async () => {
      console.log("Creating query!");
      const query = await this.engine.call("consult('/Users/morente/Desktop/THEIA_PATH/taller_tc/JE20/je20/fia/src/FIA/paradigmas/sbr/app/prolog/test.pl').");
      // const query2 = await this.engine.createQuery('es_am(X, 12).');
      const query2 = await this.engine.createQuery('test(X)');
     
      // const query2 =  await this.engine.createQuery(`get_highest_ranking(5, 4, 3)`);
      // const query2 = await this.engine.createQuery('member(X, [1,2,3,4])');
      console.log("Creating query! Resolved");
      try {
          let result;
          console.log("Set query next!");
          while (result = await query2.next()) {
              console.log("Respuesta:", result);
              console.log(`Variable X value is: ${result.X}`);
          }
      }
      catch(ex) {
        console.log("Prolog server error", ex.message)
      } finally {

          await query2.close();
      }
    })().catch((err) => console.log("Error at execute!", err));

  }
}

