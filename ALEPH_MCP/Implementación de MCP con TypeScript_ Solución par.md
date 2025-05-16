<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Implementación de MCP con TypeScript: Solución para Entornos con Soporte Limitado

El Model Context Protocol (MCP) de Anthropic es un estándar abierto que facilita la conexión entre modelos de lenguaje y fuentes de datos externas. En este informe, explicaré cómo implementar un servidor MCP en TypeScript y crear soluciones para entornos que solo soportan "tools" pero no "resources" ni "prompts".

## Entendiendo el Protocolo MCP

MCP actúa como un "puerto USB-C para aplicaciones de IA"[^1_7], estandarizando cómo las aplicaciones proporcionan contexto a los LLMs. En su arquitectura:

- **Hosts**: Aplicaciones con las que interactúa el usuario (como Claude Desktop)[^1_14][^1_15]
- **Clients**: Componentes dentro del host que gestionan la conexión a un servidor MCP específico[^1_15]
- **Servers**: Programas externos que exponen herramientas, recursos y plantillas mediante una API estándar[^1_15]

MCP define tres capacidades principales:

- **Tools** (controladas por el modelo): Funciones ejecutables que el LLM puede invocar[^1_11]
- **Resources** (controladas por la aplicación): Fuentes de datos de solo lectura[^1_11]
- **Prompts** (controlados por el usuario): Plantillas predefinidas para flujos de trabajo[^1_11]


## Configuración del Proyecto con TypeScript SDK

Para comenzar con el SDK de TypeScript, primero configuremos nuestro entorno:

```bash
mkdir mcp-server-ts
cd mcp-server-ts
npm init -y
npm install @modelcontextprotocol/sdk zod dotenv
npm install -D typescript @types/node
```

Modifica el `package.json` para incluir:

```json
{
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

Y crea un `tsconfig.json` básico:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```


## Implementando un Servidor MCP Básico

Creemos un servidor MCP básico que implementará nuestras herramientas personalizadas:

```typescript
// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Crear un servidor MCP
const server = new McpServer({
  name: "AgenteCodigo",
  version: "1.0.0"
});

// Iniciar el servidor con transporte stdio
const startServer = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Servidor MCP iniciado correctamente");
};

startServer().catch(console.error);
```


## Estrategia para Entornos Limitados

Como tu entorno solo soporta "tools" pero no "resources" ni "prompts", crearemos tools específicas para simular estas capacidades[^1_3][^1_6].

### Herramientas para Simular Resources

Los resources son fuentes de datos de solo lectura. Podemos simularlos con tools que recuperen datos:

```typescript
// Herramienta que simula un resource para recuperar documentación
server.tool(
  "getDocumentation",
  {
    topic: z.string().describe("El tema de la documentación a recuperar")
  },
  async ({ topic }) => {
    // Aquí recuperaríamos la documentación de alguna fuente
    const documentationContent = await fetchDocumentationForTopic(topic);
    
    return {
      content: [
        { 
          type: "text", 
          text: documentationContent 
        }
      ]
    };
  }
);

// Función simulada para recuperar documentación
async function fetchDocumentationForTopic(topic: string): Promise<string> {
  // En un caso real, aquí conectarías con tu base de datos o sistema de archivos
  const docs = {
    "typescript": "TypeScript es un lenguaje de programación tipado...",
    "mcp": "Model Context Protocol es un estándar abierto desarrollado por Anthropic..."
    // Más temas...
  };
  
  return docs[topic] || "Documentación no encontrada para este tema";
}
```


### Herramientas para Simular Prompts

Los prompts son plantillas predefinidas. Podemos crear tools que generen prompts basados en parámetros:

```typescript
// Almacén de plantillas de prompts
const promptTemplates = {
  "code-review": "Revisa este código:\n\n``````\n\nProporciona feedback sobre:\n1. Legibilidad\n2. Eficiencia\n3. Buenas prácticas",
  "debug-help": "Necesito ayuda para depurar el siguiente error en {{language}}:\n\n``````\n\nCódigo relacionado:\n\n``````",
  // Más plantillas...
};

// Herramienta para listar todas las plantillas disponibles
server.tool(
  "listPromptTemplates",
  {},
  async () => {
    return {
      content: [
        { 
          type: "text", 
          text: JSON.stringify(Object.keys(promptTemplates))
        }
      ]
    };
  }
);

// Herramienta para obtener una plantilla específica
server.tool(
  "getPromptTemplate",
  {
    name: z.string().describe("Nombre de la plantilla a recuperar")
  },
  async ({ name }) => {
    const template = promptTemplates[name];
    
    return {
      content: [
        { 
          type: "text", 
          text: template || "Plantilla no encontrada"
        }
      ]
    };
  }
);

// Herramienta para aplicar variables a una plantilla
server.tool(
  "applyPromptTemplate",
  {
    templateName: z.string().describe("Nombre de la plantilla a usar"),
    variables: z.record(z.string()).describe("Variables para reemplazar en la plantilla")
  },
  async ({ templateName, variables }) => {
    let template = promptTemplates[templateName];
    
    if (!template) {
      return {
        content: [{ type: "text", text: "Plantilla no encontrada" }]
      };
    }
    
    // Reemplazar variables
    Object.entries(variables).forEach(([key, value]) => {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    return {
      content: [{ type: "text", text: template }]
    };
  }
);
```


## Implementando Herramientas para Desarrollo de Código

Para un agente experto en código, añadamos herramientas específicas:

```typescript
// Analizar código
server.tool(
  "analyzeCode",
  {
    code: z.string().describe("Código a analizar"),
    language: z.string().describe("Lenguaje de programación")
  },
  async ({ code, language }) => {
    // Aquí podrías integrar con algún analizador de código o linter
    const analysis = `Análisis para código ${language}:\n` +
                     `- Longitud: ${code.length} caracteres\n` +
                     `- Número de líneas: ${code.split('\n').length}\n`;
    
    return {
      content: [{ type: "text", text: analysis }]
    };
  }
);

// Buscar ejemplos de código
server.tool(
  "findCodeExamples",
  {
    topic: z.string().describe("Tema o función para buscar ejemplos"),
    language: z.string().describe("Lenguaje de programación")
  },
  async ({ topic, language }) => {
    // Simulación - en un caso real conectarías con una base de conocimiento
    const examples = {
      "typescript-mcp": `
// Ejemplo de servidor MCP en TypeScript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
const server = new McpServer({ name: "Example", version: "1.0.0" });
server.tool("hello", {}, async () => ({ content: [{ type: "text", text: "Hello world!" }] }));
      `
    };
    
    const key = `${language}-${topic}`;
    return {
      content: [{ 
        type: "text", 
        text: examples[key] || "No se encontraron ejemplos para esta combinación de tema y lenguaje." 
      }]
    };
  }
);
```


## Implementación de Cliente MCP y Host

Ahora, creemos un cliente MCP básico que pueda comunicarse con nuestro servidor:

```typescript
// src/client.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const main = async () => {
  // Iniciar el proceso del servidor
  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"]
  });
  
  // Crear y conectar el cliente
  const client = new Client({
    name: "AgenteCodigo-Client",
    version: "1.0.0"
  });
  
  await client.connect(transport);
  console.log("Cliente MCP conectado correctamente");
  
  try {
    // Ejemplo de llamada a una herramienta
    const result = await client.callTool({
      name: "getPromptTemplate",
      arguments: { name: "code-review" }
    });
    
    console.log("Resultado:", result);
  } finally {
    // Desconectar el cliente
    await client.disconnect();
  }
};

main().catch(console.error);
```


## Integración con Claude Desktop

Claude Desktop puede funcionar como un host MCP, permitiéndote conectar tu servidor personalizado[^1_2]. Para configurarlo:

1. Instala Claude Desktop
2. Ve a Configuración > Avanzado > Conexiones MCP
3. Añade una nueva conexión con el comando para ejecutar tu servidor

Ejemplo de configuración:

```json
{
  "mcpServers": {
    "agenteCodigo": {
      "command": "node",
      "args": ["ruta/a/tu/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```


## Pruebas y Depuración

Para probar tu implementación, puedes usar herramientas como el MCP Inspector[^1_6]:

```bash
# Instalar MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Usar el inspector para probar tu servidor
npx @modelcontextprotocol/inspector "node dist/index.js"
```


## Conclusión

Aunque tu entorno solo implementa "tools", hemos logrado simular "resources" y "prompts" mediante herramientas personalizadas. Esta aproximación te permite aprovechar todo el potencial del protocolo MCP incluso con limitaciones de implementación[^1_3][^1_4].

Para mejorar aún más tu implementación, considera:

1. Organizar tus herramientas en módulos separados para mayor mantenibilidad
2. Implementar un sistema de caché para los recursos simulados
3. Añadir validación y manejo de errores robusto
4. Desarrollar tests automatizados para verificar el comportamiento de tus herramientas

Con estas herramientas personalizadas, tu agente experto en código estará preparado para asistir en el desarrollo de software de manera efectiva a través del protocolo MCP.

<div style="text-align: center">⁂</div>

[^1_1]: https://www.anthropic.com/news/model-context-protocol

[^1_2]: https://techcrunch.com/2024/11/25/anthropic-proposes-a-way-to-connect-data-to-ai-chatbots/

[^1_3]: https://github.com/modelcontextprotocol/typescript-sdk

[^1_4]: https://github.com/edanyal/mcp-client

[^1_5]: https://devblogs.microsoft.com/foundry/integrating-azure-ai-agents-mcp-typescript/

[^1_6]: https://github.com/madhukarkumar/mcp-ts-starter

[^1_7]: https://docs.anthropic.com/en/docs/agents-and-tools/mcp

[^1_8]: https://github.com/sparesparrow/mcp-prompts

[^1_9]: https://acuvity.ai/securing_anthropic_mcp

[^1_10]: https://dev.to/shadid12/how-to-build-mcp-servers-with-typescript-sdk-1c28

[^1_11]: https://huggingface.co/learn/mcp-course/unit1/capabilities

[^1_12]: https://docs.anthropic.com/es/docs/agents-and-tools/mcp

[^1_13]: https://github.com/i-am-bee/mcp-typescript-sdk

[^1_14]: https://www.philschmid.de/mcp-introduction

[^1_15]: https://wandb.ai/onlineinference/mcp/reports/The-Model-Context-Protocol-MCP-by-Anthropic-Origins-functionality-and-impact--VmlldzoxMTY5NDI4MQ

[^1_16]: https://hackteam.io/blog/build-your-first-mcp-server-with-typescript-in-under-10-minutes/

[^1_17]: https://www.deeplearning.ai/short-courses/mcp-build-rich-context-ai-apps-with-anthropic/

[^1_18]: https://www.youtube.com/watch?v=kXuRJXEzrE0

[^1_19]: https://github.com/modelcontextprotocol

[^1_20]: https://modelcontextprotocol.io/introduction

[^1_21]: https://es.linkedin.com/posts/ccastillog_si-bien-anthropic-lanz%C3%B3-su-mcp-model-context-activity-7322118292884656128-WREk

[^1_22]: https://www.reddit.com/r/modelcontextprotocol/comments/1ju0ly7/mcp_official_typescriptsdk_190_released/

[^1_23]: https://www.youtube.com/watch?v=jog5-UigoTg

[^1_24]: https://www.youtube.com/watch?v=kXuRJXEzrE0

[^1_25]: https://github.com/i-am-bee/mcp-typescript-sdk

[^1_26]: https://google.github.io/adk-docs/tools/mcp-tools/

[^1_27]: https://blog.promptlayer.com/claude-mcp/

[^1_28]: https://github.com/jiangyan/typescript-mcp-demo

[^1_29]: https://github.com/modelcontextprotocol/typescript-sdk

[^1_30]: https://mcpmarket.com/server/typescript-prompt

[^1_31]: https://dev.to/shadid12/how-to-build-mcp-servers-with-typescript-sdk-1c28

[^1_32]: https://hackteam.io/blog/build-your-first-mcp-server-with-typescript-in-under-10-minutes/

[^1_33]: https://www.npmjs.com/package/@modelcontextprotocol/sdk/v/0.6.1

[^1_34]: https://apidog.com/blog/mcp-server-connect-claude-desktop/

[^1_35]: https://www.reddit.com/r/mcp/comments/1jymmn9/here_is_my_mcp_server_prompt_to_pretty_much/

[^1_36]: https://mcp.so

[^1_37]: https://docs.cursor.com/context/model-context-protocol

[^1_38]: https://ganhua.wang/mcp-serverresourceserver-inspector

