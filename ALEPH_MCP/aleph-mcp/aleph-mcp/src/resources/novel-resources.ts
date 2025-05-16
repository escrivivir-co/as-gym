import { z } from "zod";

// Esquemas Zod para validación de recursos
export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  traits: z.array(z.string()),
  backstory: z.string().optional(),
});

export const SceneSchema = z.object({
  id: z.string(),
  title: z.string(),
  setting: z.string(),
  characters: z.array(z.string()), // IDs de personajes
  summary: z.string(),
  content: z.string().optional(),
});

export const ChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  scenes: z.array(z.string()), // IDs de escenas
  summary: z.string(),
});

export const NovelSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  genre: z.array(z.string()),
  summary: z.string(),
  characters: z.array(z.string()), // IDs de personajes
  chapters: z.array(z.string()), // IDs de capítulos
  setting: z.string(),
  timeline: z.string().optional(),
});

// Tipos derivados de los esquemas
export type Character = z.infer<typeof CharacterSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;
export type Novel = z.infer<typeof NovelSchema>;

// Tipo para todos los recursos
export type NovelResource = 
  | { type: "character", data: Character }
  | { type: "scene", data: Scene }
  | { type: "chapter", data: Chapter }
  | { type: "novel", data: Novel };

// Tipo para la colección completa de recursos
export type NovelResources = {
  characters: Record<string, Character>;
  scenes: Record<string, Scene>;
  chapters: Record<string, Chapter>;
  novels: Record<string, Novel>;
};

// Tipo para prompt templates específicos de novela
export type NovelPromptTemplate = {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
};