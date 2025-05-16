# AlephAlpha MCP Tools - Guía de integración con GitHub Copilot

## Contexto

Este documento sirve como guía para entender la integración entre el servidor MCP (Model Context Protocol) de AlephAlpha y GitHub Copilot en VS Code. El objetivo es facilitar futuras sesiones de trabajo para mejorar y extender las herramientas de AlephAlpha.

## Relación entre herramientas de AlephAlpha y GitHub Copilot

### Configuración y conexión

GitHub Copilot Agent puede acceder a las herramientas de AlephAlpha MCP gracias a la configuración en el archivo `.vscode/mcp.json`:

```json
{
  "servers": {
    "AlephAlpha": {
      "type": "http",
      "url": "http://localhost:3000",
    }
  }
}
```

Esta configuración establece una conexión con el servidor MCP AlephAlpha que corre en `localhost:3000`.

### Mapeo de herramientas

| AlephAlpha MCP Tool              | GitHub Copilot Tool                 | Ubicación en el proyecto                        | Funcionalidad                                      |
|----------------------------------|-------------------------------------|-------------------------------------------------|---------------------------------------------------|
| `alephAlpha_analyzeCode`         | `a0b_alephAlpha_analyzeCode`        | `src/tools/code-tools.ts`                       | Analiza snippets de código (estructura, complejidad) |
| `alephAlpha_findCodeExamples`    | `a0b_alephAlpha_findCodeExamples`   | `src/tools/code-tools.ts`                       | Busca ejemplos de código por tema y lenguaje       |
| `alephAlpha_getDocumentation`    | `a0b_alephAlpha_getDocumentation`   | `src/tools/documentation-tools.ts`              | Obtiene documentación sobre un tema específico     |
| `alephAlpha_searchDocumentation` | `a0b_alephAlpha_searchDocumentation`| `src/tools/documentation-tools.ts`              | Busca en la documentación disponible               |
| `alephAlpha_listPromptTemplates` | `a0b_alephAlpha_listPromptTemplates`| `src/tools/prompt-tools.ts`                     | Lista todas las plantillas de prompts disponibles  |
| `alephAlpha_getPromptTemplate`   | `a0b_alephAlpha_getPromptTemplate`  | `src/tools/prompt-tools.ts`                     | Obtiene contenido de una plantilla específica      |
| `alephAlpha_applyPromptTemplate` | `a0b_alephAlpha_applyPromptTemplate`| `src/tools/prompt-tools.ts`                     | Aplica variables a una plantilla y devuelve texto  |

### Cómo funciona la integración

1. **Prefijo de acceso**: GitHub Copilot Agent accede a las herramientas del servidor MCP a través del prefijo `a0b_` seguido por el nombre de la herramienta.
2. **Flujo de trabajo**: Cuando se invoca `a0b_alephAlpha_analyzeCode`, Copilot envía una petición al servidor MCP configurado, llamando a la herramienta `alephAlpha_analyzeCode`.
3. **Implementación**: Las herramientas MCP se definen en el código fuente con la función `server.tool()` y se registran en `index.ts`.
4. **Convención de nombres**: Hemos adoptado la convención de prefijo `alephAlpha_` para nuestras herramientas, lo que resulta en nombres como `a0b_alephAlpha_toolName` cuando se accede desde Copilot.

## Ejemplos de uso

### Análisis de código
```javascript
// Invocación desde Copilot Agent
a0b_alephAlpha_analyzeCode({
  code: "function sum(a, b) { return a + b; }",
  language: "javascript"
});

// Respuesta
// Analysis for javascript code:
// - Length: 36 characters
// - Number of lines: 1
// - Number of functions: 1
```

### Aplicación de plantillas
```javascript
// Invocación desde Copilot Agent
a0b_alephAlpha_applyPromptTemplate({
  templateName: "debug-help",
  variables: {
    "language": "typescript",
    "error": "Type error: string not assignable to number",
    "code": "function calculate(x: number): number { return x + 'px'; }"
  }
});

// Respuesta: plantilla con las variables reemplazadas
```

## Convención de nomenclatura para las herramientas MCP

Para facilitar la identificación de las herramientas de AlephAlpha en el código y en el uso desde GitHub Copilot, hemos adoptado las siguientes convenciones:

1. **Prefijo de herramientas**: Todas las herramientas del servidor MCP usan el prefijo `alephAlpha_` en su nombre (por ejemplo: `alephAlpha_analyzeCode`).

2. **Acceso desde Copilot**: Cuando se accede desde GitHub Copilot, las herramientas tienen el prefijo `a0b_` seguido del nombre de la herramienta (ejemplo: `a0b_alephAlpha_analyzeCode`).

3. **Agrupación por dominio**: Las herramientas están organizadas en tres categorías principales:
   - Herramientas de código (`alephAlpha_analyzeCode`, `alephAlpha_findCodeExamples`)
   - Herramientas de documentación (`alephAlpha_getDocumentation`, `alephAlpha_searchDocumentation`)
   - Herramientas de plantillas (`alephAlpha_listPromptTemplates`, `alephAlpha_getPromptTemplate`, `alephAlpha_applyPromptTemplate`)

Esta convención permite mantener un espacio de nombres limpio y coherente en el proyecto.

## Cómo mejorar AlephAlpha MCP

Para mejorar las herramientas existentes o añadir nuevas:

1. Modificar o crear nuevas funciones en los archivos correspondientes:
   - Herramientas de código: `src/tools/code-tools.ts`
   - Herramientas de documentación: `src/tools/documentation-tools.ts`
   - Herramientas de prompts: `src/tools/prompt-tools.ts`
   - Plantillas: `src/tools/templates.ts`

2. Asegurarse que las herramientas están registradas en `src/index.ts`

3. Reiniciar el servidor MCP para que los cambios surtan efecto

## Desarrollo y pruebas

Al añadir nuevas funcionalidades a AlephAlpha MCP:

1. Definir claramente el propósito y parámetros de la herramienta
2. Implementar la lógica en el archivo apropiado siguiendo la convención de nombres `alephAlpha_nombreHerramienta`
3. Probar la funcionalidad a través de GitHub Copilot usando el prefijo completo `a0b_alephAlpha_nombreHerramienta`
4. Verificar las respuestas y refinar según sea necesario

### Ejemplo de adición de nueva herramienta

Para añadir una nueva herramienta llamada `alephAlpha_translateCode` que traduzca código entre lenguajes de programación:

1. Decidir en qué archivo añadirla (probablemente `code-tools.ts`)
2. Implementar la función siguiendo el patrón existente:
   ```typescript
   server.tool(
     "alephAlpha_translateCode",
     "Translates code from one programming language to another",
     {
       sourceCode: z.string().describe("Source code to translate"),
       sourceLanguage: z.string().describe("Source programming language"),
       targetLanguage: z.string().describe("Target programming language")
     },
     async ({ sourceCode, sourceLanguage, targetLanguage }) => {
       // Implementación de la traducción
       // ...
       
       return {
         content: [{ type: "text", text: translatedCode }],
         description: "Translates code from one programming language to another"
       };
     }
   );
   ```
3. Registrar la herramienta en `index.ts` (si no está ya incluida en la función de registro)
4. Reiniciar el servidor MCP
5. Probar la herramienta usando `a0b_alephAlpha_translateCode` desde GitHub Copilot

---

Este documento se actualizará conforme se añadan nuevas herramientas o funcionalidades al servidor AlephAlpha MCP.