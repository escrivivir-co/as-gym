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
}
