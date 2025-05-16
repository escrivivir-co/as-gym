import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { NovelResourceLoader } from '../resources/resource-loader.js';

export function registerNovelistTools(server: McpServer) {
  // Obtener instancia del cargador de recursos
  const resourceLoader = NovelResourceLoader.getInstance();

  // Herramienta: Listar novelas
  server.tool('alephAlpha_listNovels', 'Lists all available novels', {}, async () => {
    const novels = resourceLoader.getNovels();
    const novelList = Object.values(novels).map((novel) => ({
      id: novel.id,
      title: novel.title,
      author: novel.author,
      genre: novel.genre.join(', '),
      summary: novel.summary,
    }));

    return {
      content: [{ type: 'text', text: JSON.stringify(novelList, null, 2) }],
      description: 'Lists all available novels',
    };
  });

  // Herramienta: Obtener detalles de una novela
  server.tool(
    'alephAlpha_getNovelDetails',
    'Gets detailed information about a novel',
    {
      novelId: z.string().describe('ID of the novel to retrieve'),
    },
    async ({ novelId }) => {
      const novel = resourceLoader.getNovel(novelId);

      if (!novel) {
        return {
          content: [{ type: 'text', text: `Novel with ID ${novelId} not found.` }],
          description: 'Error: Novel not found',
        };
      }

      // Obtener personajes relacionados
      const characters = novel.characters.map((charId: string) => {
        const character = resourceLoader.getCharacter(charId);
        return character ? { id: charId, name: character.name } : { id: charId, name: 'Unknown' };
      });

      // Obtener capítulos relacionados
      const chapters = novel.chapters.map((chapId: string) => {
        const chapter = resourceLoader.getChapter(chapId);
        return chapter ? { id: chapId, title: chapter.title } : { id: chapId, title: 'Unknown' };
      });

      const result = {
        ...novel,
        characters,
        chapters,
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        description: 'Detailed information about the novel',
      };
    }
  );

  // Herramienta: Listar personajes
  server.tool(
    'alephAlpha_listCharacters',
    'Lists all characters or characters in a specific novel',
    {
      novelId: z.string().optional().describe('Optional: ID of the novel to filter characters'),
    },
    async ({ novelId }) => {
      if (novelId) {
        const novel = resourceLoader.getNovel(novelId);
        if (!novel) {
          return {
            content: [{ type: 'text', text: `Novel with ID ${novelId} not found.` }],
            description: 'Error: Novel not found',
          };
        }

        const characters = novel.characters.map((charId: string) => {
          const character = resourceLoader.getCharacter(charId);
          return character
            ? {
                id: character.id,
                name: character.name,
                description: character.description,
              }
            : { id: charId, name: 'Unknown', description: 'Character not found' };
        });

        return {
          content: [{ type: 'text', text: JSON.stringify(characters, null, 2) }],
          description: `Characters in novel "${novel.title}"`,
        };
      } else {
        const allCharacters = Object.values(resourceLoader.getCharacters()).map((character) => ({
          id: character.id,
          name: character.name,
          description: character.description,
        }));

        return {
          content: [{ type: 'text', text: JSON.stringify(allCharacters, null, 2) }],
          description: 'All available characters',
        };
      }
    }
  );

  // Herramienta: Obtener detalles de un personaje
  server.tool(
    'alephAlpha_getCharacterDetails',
    'Gets detailed information about a character',
    {
      characterId: z.string().describe('ID of the character to retrieve'),
    },
    async ({ characterId }) => {
      const character = resourceLoader.getCharacter(characterId);

      if (!character) {
        return {
          content: [{ type: 'text', text: `Character with ID ${characterId} not found.` }],
          description: 'Error: Character not found',
        };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(character, null, 2) }],
        description: `Detailed information about character "${character.name}"`,
      };
    }
  );

  // Herramienta: Listar plantillas de prompts para novelistas
  server.tool(
    'alephAlpha_listNovelistPromptTemplates',
    'Lists all available prompt templates for novel writing assistance',
    {},
    async () => {
      const templates = resourceLoader.getPromptTemplates();
      const templateList = templates.map((template) => ({
        id: template.id,
        name: template.name,
        description: template.description,
        variables: template.variables,
      }));

      return {
        content: [{ type: 'text', text: JSON.stringify(templateList, null, 2) }],
        description: 'List of available novelist prompt templates',
      };
    }
  );

  // Herramienta: Obtener plantilla de prompt específica
  server.tool(
    'alephAlpha_getNovelistPromptTemplate',
    'Gets a specific prompt template for novel writing',
    {
      templateId: z.string().describe('ID of the prompt template to retrieve'),
    },
    async ({ templateId }) => {
      const template = resourceLoader.getPromptTemplate(templateId);

      if (!template) {
        return {
          content: [{ type: 'text', text: `Prompt template with ID ${templateId} not found.` }],
          description: 'Error: Prompt template not found',
        };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(template, null, 2) }],
        description: `Prompt template: ${template.name}`,
      };
    }
  );

  // Herramienta: Aplicar plantilla de prompt
  server.tool(
    'alephAlpha_applyNovelistPromptTemplate',
    'Applies variables to a novelist prompt template and returns the completed prompt',
    {
      templateId: z.string().describe('ID of the prompt template to use'),
      variables: z.record(z.string()).describe('Variables to insert into the template'),
    },
    async ({ templateId, variables }) => {
      const result = resourceLoader.applyPromptTemplate(templateId, variables);

      if (!result) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to apply template. Template with ID ${templateId} not found.`,
            },
          ],
          description: 'Error: Failed to apply template',
        };
      }

      return {
        content: [{ type: 'text', text: result }],
        description: 'Completed prompt from template',
      };
    }
  );

  // Herramienta: Obtener escena
  server.tool(
    'alephAlpha_getScene',
    'Gets the content of a specific scene',
    {
      sceneId: z.string().describe('ID of the scene to retrieve'),
    },
    async ({ sceneId }) => {
      const scene = resourceLoader.getScene(sceneId);

      if (!scene) {
        return {
          content: [{ type: 'text', text: `Scene with ID ${sceneId} not found.` }],
          description: 'Error: Scene not found',
        };
      }

      // Obtener personajes relacionados
      const characters = scene.characters.map((charId: string) => {
        const character = resourceLoader.getCharacter(charId);
        return character ? { id: charId, name: character.name } : { id: charId, name: 'Unknown' };
      });

      const result = {
        ...scene,
        characters,
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        description: `Scene: ${scene.title}`,
      };
    }
  );

  // Herramienta para documentar el sistema de novela
  server.tool(
    "alephAlpha_getNovelistSystemInfo",
    "Provides information about the Novelist Assistant system architecture and features",
    {},
    async () => {
      const systemInfo = {
        overview: "El Asistente para Novelistas de AlephAlpha proporciona herramientas para ayudar en el proceso de escritura creativa, gestionando recursos como novelas, personajes, escenas y capítulos, así como plantillas de prompts específicas para la escritura.",

        architecture: {
          components: [
            {
              name: "Recursos (Resources)",
              description: "Representan entidades en el sistema de novela",
              types: [
                {
                  name: "Novela (Novel)",
                  description: "Contenedor principal que incluye título, autor, género, resumen, y referencias a personajes y capítulos",
                  properties: ["id", "title", "author", "genre", "summary", "characters", "chapters", "setting", "timeline"]
                },
                {
                  name: "Personaje (Character)",
                  description: "Representa un personaje de la novela con nombre, descripción, rasgos y trasfondo",
                  properties: ["id", "name", "description", "traits", "backstory"]
                },
                {
                  name: "Escena (Scene)",
                  description: "Representa una escena individual con título, ubicación, personajes presentes y contenido",
                  properties: ["id", "title", "setting", "characters", "summary", "content"]
                },
                {
                  name: "Capítulo (Chapter)",
                  description: "Agrupa escenas relacionadas bajo un título común",
                  properties: ["id", "title", "scenes", "summary"]
                }
              ]
            },
            {
              name: "Plantillas (Prompts)",
              description: "Plantillas de texto predefinidas para diferentes aspectos de la escritura creativa",
              examples: [
                {
                  name: "start-novel",
                  description: "Para comenzar una nueva novela"
                },
                {
                  name: "develop-character",
                  description: "Para desarrollar personajes en profundidad"
                },
                {
                  name: "continue-scene",
                  description: "Para continuar escribiendo una escena en curso"
                },
                {
                  name: "plot-development",
                  description: "Para generar ideas de desarrollo de trama"
                },
                {
                  name: "writing-feedback",
                  description: "Para obtener retroalimentación sobre fragmentos escritos"
                }
              ]
            },
            {
              name: "Herramientas (Tools)",
              description: "Funciones MCP para interactuar con los recursos y plantillas",
              list: [
                { name: "alephAlpha_listNovels", description: "Lista todas las novelas disponibles" },
                { name: "alephAlpha_getNovelDetails", description: "Obtiene información detallada de una novela" },
                { name: "alephAlpha_listCharacters", description: "Lista personajes, opcionalmente filtrados por novela" },
                { name: "alephAlpha_getCharacterDetails", description: "Obtiene información detallada de un personaje" },
                { name: "alephAlpha_getScene", description: "Obtiene el contenido de una escena específica" },
                { name: "alephAlpha_listNovelistPromptTemplates", description: "Lista plantillas disponibles para escritura" },
                { name: "alephAlpha_getNovelistPromptTemplate", description: "Obtiene una plantilla específica" },
                { name: "alephAlpha_applyNovelistPromptTemplate", description: "Aplica variables a una plantilla" }
              ]
            }
          ]
        },

        workflow: {
          description: "Flujo de trabajo típico para usar el asistente de novelista",
          steps: [
            "1. Explorar novelas disponibles con alephAlpha_listNovels",
            "2. Crear o seleccionar una novela existente",
            "3. Explorar o crear personajes usando alephAlpha_listCharacters y alephAlpha_getCharacterDetails",
            "4. Trabajar en escenas específicas con alephAlpha_getScene",
            "5. Utilizar plantillas de prompts para diferentes tareas de escritura mediante alephAlpha_applyNovelistPromptTemplate"
          ]
        },

        bestPractices: [
          "Organizar personajes y escenas antes de comenzar a escribir capítulos completos",
          "Utilizar las plantillas de prompts para superar el bloqueo del escritor",
          "Mantener resúmenes actualizados para facilitar la navegación por la estructura de la novela",
          "Desarrollar personajes en profundidad usando la plantilla develop-character",
          "Solicitar feedback sobre fragmentos escritos usando writing-feedback"
        ]
      };

      return {
        content: [{ type: "text", text: JSON.stringify(systemInfo, null, 2) }],
        description: "Información sobre el sistema de asistente para novelistas"
      };
    }
  );
}
