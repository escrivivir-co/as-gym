import { ChatCompletionRequestMessageRoleEnum } from "./Inferencia-open-ai";

export interface IApiMessage {
    role: string;
    content: string;
}

export interface IOpenAiApiMessage extends IApiMessage {
    role: ChatCompletionRequestMessageRoleEnum;
    content: string;
}

export interface PromptBase {
    system: {
        background: string;
        format: string;
    },
    assistant: {
        cache: string;
        archive: string;
    },
    user: {
        analytics: string;
        prompt: string;
    }
}

export class OpenAiApiMessage implements OpenAiApiMessage {
    role: ChatCompletionRequestMessageRoleEnum;
    content: string;
}
