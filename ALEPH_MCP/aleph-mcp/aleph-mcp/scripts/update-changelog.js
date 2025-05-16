// Script para actualizar automáticamente el CHANGELOG.md
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas a los archivos
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');

// Leer el archivo package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Obtener la fecha actual en formato YYYY-MM-DD
const today = new Date();
const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

// Leer el archivo CHANGELOG.md
let changelog = fs.readFileSync(changelogPath, 'utf8');

// Verificar si la versión ya existe en el changelog
if (changelog.includes(`## [${version}]`)) {
  console.log(`La versión ${version} ya existe en el CHANGELOG.md.`);
  process.exit(0);
}

// Preparar la nueva entrada para el changelog
const newEntry = `## [${version}] - ${formattedDate}

### Añadido
- 

### Modificado
- 

### Corregido
- 

`;

// Encontrar la posición donde insertar la nueva entrada
// Buscamos después del encabezado y antes de la primera versión
const headerEndPos = changelog.indexOf('## [');
if (headerEndPos === -1) {
  console.error('Formato de CHANGELOG no reconocido. No se pudo encontrar la posición para insertar la nueva versión.');
  process.exit(1);
}

// Insertar la nueva entrada después del encabezado
const updatedChangelog = changelog.slice(0, headerEndPos) + newEntry + changelog.slice(headerEndPos);

// Escribir el changelog actualizado
fs.writeFileSync(changelogPath, updatedChangelog, 'utf8');

console.log(`CHANGELOG.md actualizado con la versión ${version}.`);
console.log('Por favor, complete manualmente los detalles de los cambios en esta versión.');

// Recordatorio para el usuario
console.log('\nRecuerde hacer commit de los cambios:');
console.log('git add CHANGELOG.md');
console.log('git commit -m "docs: update CHANGELOG for version ' + version + '"');
