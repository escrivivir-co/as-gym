
export interface Completion {
	ram: object; // A RAM like memory storage object to keep tracked most relevant keys from conversation context. Calculated by you. Store here any relevant information to trace this conversation. Include things like history, tasks, goals,...
	request: string; // The original question from this prompt. Can be croped if needed.
	response: string; // Your answer as plain when you need to add further explanations in natural language.
	code: string | string[]; // If the prompt requires code generation this fields holds the code raw ready to compile. If more than one file is edit, fill array one per each code file given. For example, if it is a prolog file it must be headed with module definition.
	analytics: object; // A JSON representing the current thread analytics report. Calculated by you and append after each request. You can fill any field on this object.
}
