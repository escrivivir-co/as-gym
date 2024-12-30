type FunctionParameter = {
	type: string;
	description: string;
	default?: any; // Si la propiedad tiene un valor por defecto
};

type FunctionDefinition = {
	name: string;
	description: string;
	parameters: {
	  type: "object";
	  properties: {
		[key: string]: FunctionParameter; // Cada parámetro es un objeto con tipo y descripción
	  };
	  required: string[]; // Lista de los parámetros obligatorios
	};
};

export const functionDefinitions: FunctionDefinition[] = [
	{
	  name: "readFileSyncWrapper",
	  description: "Reads the content of a file synchronously.",
	  parameters: {
		type: "object",
		properties: {
		  filePath: {
			type: "string",
			description: "The path to the file to read.",
		  },
		},
		required: ["filePath"],
	  },
	},
	{
	  name: "writeFileSyncWrapper",
	  description: "Writes content to a file synchronously.",
	  parameters: {
		type: "object",
		properties: {
		  filePath: {
			type: "string",
			description: "The path to the file to write to.",
		  },
		  content: {
			type: "string",
			description: "The content to write to the file.",
		  },
		},
		required: ["filePath", "content"],
	  },
	},
	{
	  name: "insertLineInFile",
	  description: "Inserts a new line of content at a specific line number in a file.",
	  parameters: {
		type: "object",
		properties: {
		  filePath: {
			type: "string",
			description: "The path to the file.",
		  },
		  lineNumber: {
			type: "integer",
			description: "The line number where the new content will be inserted.",
		  },
		  newContent: {
			type: "string",
			description: "The content to insert at the specified line.",
		  },
		},
		required: ["filePath", "lineNumber", "newContent"],
	  },
	},
	{
	  name: "modifyLineInFile",
	  description: "Modifies the content of a specific line in a file.",
	  parameters: {
		type: "object",
		properties: {
		  filePath: {
			type: "string",
			description: "The path to the file.",
		  },
		  lineNumber: {
			type: "integer",
			description: "The line number to modify.",
		  },
		  newContent: {
			type: "string",
			description: "The new content to replace the existing line.",
		  },
		},
		required: ["filePath", "lineNumber", "newContent"],
	  },
	},
	{
	  name: "deleteLineInFile",
	  description: "Deletes a specific line in a file.",
	  parameters: {
		type: "object",
		properties: {
		  filePath: {
			type: "string",
			description: "The path to the file.",
		  },
		  lineNumber: {
			type: "integer",
			description: "The line number to delete.",
		  },
		},
		required: ["filePath", "lineNumber"],
	  },
	},
	{
	  name: "findAndReplaceInFile",
	  description: "Finds and replaces all occurrences of a string in a file.",
	  parameters: {
		type: "object",
		properties: {
		  filePath: {
			type: "string",
			description: "The path to the file.",
		  },
		  searchValue: {
			type: "string",
			description: "The value to search for.",
		  },
		  replaceValue: {
			type: "string",
			description: "The value to replace the search value with.",
		  },
		},
		required: ["filePath", "searchValue", "replaceValue"],
	  },
	},
	{
	  name: "appendToFile",
	  description: "Appends content to the end of a file.",
	  parameters: {
		type: "object",
		properties: {
		  filePath: {
			type: "string",
			description: "The path to the file.",
		  },
		  newContent: {
			type: "string",
			description: "The content to append to the file.",
		  },
		},
		required: ["filePath", "newContent"],
	  },
	},
	{
	  name: "createFile",
	  description: "Creates a new file if it does not exist, and writes optional initial content to it.",
	  parameters: {
		type: "object",
		properties: {
		  filePath: {
			type: "string",
			description: "The path to the file.",
		  },
		  initialContent: {
			type: "string",
			description: "The content to write in the file, if any.",
			default: "",
		  },
		},
		required: ["filePath"],
	  },
	},
	{
	  name: "deleteFile",
	  description: "Deletes a file if it exists.",
	  parameters: {
		type: "object",
		properties: {
		  filePath: {
			type: "string",
			description: "The path to the file to delete.",
		  },
		},
		required: ["filePath"],
	  },
	},
	{
	  name: "trackFilesInDirectory",
	  description: "Tracks and lists all files within a directory recursively.",
	  parameters: {
		type: "object",
		properties: {
		  directoryPath: {
			type: "string",
			description: "The path to the directory to track files in.",
		  },
		},
		required: ["directoryPath"],
	  },
	},
  ];
  