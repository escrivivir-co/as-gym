import * as fs from 'fs';
import * as path from 'path';

export class DevOpsFileManager {
  // Lee el contenido de un archivo de forma sincrónica
  static readFileSyncWrapper(filePath: string): string | undefined {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return data;
    } catch (err) {
      console.error(`Error reading file from disk: ${err}`);
    }
  }

  // Escribe contenido en un archivo de forma sincrónica
  static writeFileSyncWrapper(filePath: string, content: string): void {
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('File written successfully.');
    } catch (err) {
      console.error(`Error writing file to disk: ${err}`);
    }
  }

  // Inserta una nueva línea en un archivo en una posición específica
  static insertLineInFile(filePath: string, lineNumber: number, newContent: string): void {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8').split('\n');
      if (lineNumber > fileContent.length || lineNumber < 0) {
        console.error('Invalid line number.');
        return;
      }
      fileContent.splice(lineNumber, 0, newContent);
      fs.writeFileSync(filePath, fileContent.join('\n'), 'utf-8');
      console.log('Line inserted successfully.');
    } catch (err) {
      console.error(`Error inserting line in file: ${err}`);
    }
  }

  // Modifica una línea específica en un archivo
  static modifyLineInFile(filePath: string, lineNumber: number, newContent: string): void {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8').split('\n');
      if (lineNumber >= fileContent.length || lineNumber < 0) {
        console.error('Invalid line number.');
        return;
      }
      fileContent[lineNumber] = newContent;
      fs.writeFileSync(filePath, fileContent.join('\n'), 'utf-8');
      console.log('Line modified successfully.');
    } catch (err) {
      console.error(`Error modifying line in file: ${err}`);
    }
  }

  // Elimina una línea específica de un archivo
  static deleteLineInFile(filePath: string, lineNumber: number): void {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8').split('\n');
      if (lineNumber >= fileContent.length || lineNumber < 0) {
        console.error('Invalid line number.');
        return;
      }
      fileContent.splice(lineNumber, 1);
      fs.writeFileSync(filePath, fileContent.join('\n'), 'utf-8');
      console.log('Line deleted successfully.');
    } catch (err) {
      console.error(`Error deleting line in file: ${err}`);
    }
  }

  // Busca y reemplaza contenido en un archivo
  static findAndReplaceInFile(filePath: string, searchValue: string, replaceValue: string): void {
    try {
      let fileContent = fs.readFileSync(filePath, 'utf-8');
      fileContent = fileContent.replace(new RegExp(searchValue, 'g'), replaceValue);
      fs.writeFileSync(filePath, fileContent, 'utf-8');
      console.log('Search and replace completed successfully.');
    } catch (err) {
      console.error(`Error replacing content in file: ${err}`);
    }
  }

  // Añade contenido al final de un archivo
  static appendToFile(filePath: string, newContent: string): void {
    try {
      fs.appendFileSync(filePath, `\n${newContent}`, 'utf-8');
      console.log('Content appended successfully.');
    } catch (err) {
      console.error(`Error appending content to file: ${err}`);
    }
  }

  // Crea un archivo si no existe, y opcionalmente escribe contenido inicial
  static createFile(filePath: string, initialContent: string = ''): void {
    try {
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, initialContent, 'utf-8');
        console.log('File created successfully.');
      } else {
        console.log('File already exists.');
      }
    } catch (err) {
      console.error(`Error creating file: ${err}`);
    }
  }

  // Elimina un archivo si existe
  static deleteFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('File deleted successfully.');
      } else {
        console.log('File does not exist.');
      }
    } catch (err) {
      console.error(`Error deleting file: ${err}`);
    }
  }

  // Rastrea y lista todos los archivos en un directorio de forma recursiva
  static trackFilesInDirectory(directoryPath: string): string[] | undefined {
    try {
      const filesList: string[] = [];
      
      function traverseDirectory(currentPath: string): void {
        const files = fs.readdirSync(currentPath);
        for (const file of files) {
          const fullPath = path.join(currentPath, file);
          const stats = fs.statSync(fullPath);
          if (stats.isDirectory()) {
            traverseDirectory(fullPath); // Recurre si es un directorio
          } else {
            filesList.push(fullPath); // Agrega archivo a la lista
          }
        }
      }
      
      traverseDirectory(directoryPath);
      return filesList;
    } catch (err) {
      console.error(`Error tracking files in directory: ${err}`);
    }
  }

  test() {

		// Ejemplo de uso para rastrear archivos
		const trackedFiles = DevOpsFileManager.trackFilesInDirectory('/Users/morente/Desktop/THEIA_PATH/AlephWeb/angular-app/alephscript');
		console.log(trackedFiles);

  }
}
