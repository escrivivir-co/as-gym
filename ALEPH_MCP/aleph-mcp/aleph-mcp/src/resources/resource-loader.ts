import { readFileSync } from 'fs';
import { 
  NovelResources, 
  NovelPromptTemplate,
  CharacterSchema,
  SceneSchema,
  ChapterSchema,
  NovelSchema
} from './novel-resources.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clase para cargar y gestionar recursos de novela
export class NovelResourceLoader {
  private resources: NovelResources;
  private promptTemplates: NovelPromptTemplate[];
  private static instance: NovelResourceLoader;

  private constructor() {
    this.resources = {
      characters: {},
      scenes: {},
      chapters: {},
      novels: {}
    };
    this.promptTemplates = [];
    this.loadFromFile();
  }

  public static getInstance(): NovelResourceLoader {
    if (!NovelResourceLoader.instance) {
      NovelResourceLoader.instance = new NovelResourceLoader();
    }
    return NovelResourceLoader.instance;
  }

  private loadFromFile(): void {
    try {
      const dataPath = path.join(__dirname, 'novel-data.json');
      const fileContent = readFileSync(dataPath, 'utf-8');
      const data = JSON.parse(fileContent);

      // Validar y cargar recursos
      if (data.resources) {
        // Cargar personajes
        if (data.resources.characters) {
          Object.entries(data.resources.characters).forEach(([id, character]) => {
            try {
              const validatedCharacter = CharacterSchema.parse(character);
              this.resources.characters[id] = validatedCharacter;
            } catch (error) {
              console.error(`Error validating character ${id}:`, error);
            }
          });
        }

        // Cargar escenas
        if (data.resources.scenes) {
          Object.entries(data.resources.scenes).forEach(([id, scene]) => {
            try {
              const validatedScene = SceneSchema.parse(scene);
              this.resources.scenes[id] = validatedScene;
            } catch (error) {
              console.error(`Error validating scene ${id}:`, error);
            }
          });
        }

        // Cargar capítulos
        if (data.resources.chapters) {
          Object.entries(data.resources.chapters).forEach(([id, chapter]) => {
            try {
              const validatedChapter = ChapterSchema.parse(chapter);
              this.resources.chapters[id] = validatedChapter;
            } catch (error) {
              console.error(`Error validating chapter ${id}:`, error);
            }
          });
        }

        // Cargar novelas
        if (data.resources.novels) {
          Object.entries(data.resources.novels).forEach(([id, novel]) => {
            try {
              const validatedNovel = NovelSchema.parse(novel);
              this.resources.novels[id] = validatedNovel;
            } catch (error) {
              console.error(`Error validating novel ${id}:`, error);
            }
          });
        }
      }

      // Cargar plantillas de prompts
      if (data.promptTemplates) {
        this.promptTemplates = data.promptTemplates;
      }

      console.log('Novel resources and templates loaded successfully');
    } catch (error) {
      console.error('Error loading novel resources:', error);
    }
  }

  // Métodos para acceder a los recursos
  public getCharacters(): Record<string, any> {
    return this.resources.characters;
  }

  public getCharacter(id: string): any | null {
    return this.resources.characters[id] || null;
  }

  public getScenes(): Record<string, any> {
    return this.resources.scenes;
  }

  public getScene(id: string): any | null {
    return this.resources.scenes[id] || null;
  }

  public getChapters(): Record<string, any> {
    return this.resources.chapters;
  }

  public getChapter(id: string): any | null {
    return this.resources.chapters[id] || null;
  }

  public getNovels(): Record<string, any> {
    return this.resources.novels;
  }

  public getNovel(id: string): any | null {
    return this.resources.novels[id] || null;
  }

  public getPromptTemplates(): NovelPromptTemplate[] {
    return this.promptTemplates;
  }

  public getPromptTemplate(id: string): NovelPromptTemplate | null {
    return this.promptTemplates.find(template => template.id === id) || null;
  }

  // Método para aplicar una plantilla de prompt con variables
  public applyPromptTemplate(templateId: string, variables: Record<string, string>): string | null {
    const template = this.getPromptTemplate(templateId);
    if (!template) return null;

    let result = template.template;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    return result;
  }
}