import OpenAI from "openai";
import { IModelo } from "../../../../mundos/modelo";

const auth = require('../../../../../../package.json');

const MAX_TOKENS = 750;

export enum STATES {
	NOT_INIT
}

export interface ApiRequest {
	messages:	 any[];
}

export interface ApiReply {
	ok:	 boolean;
	data: any;
}

export interface ApiState {
	state: STATES;
	request?: ApiRequest;
	reply?:	 ApiReply;

	modelo?: IModelo
}

export const IA_MODEL = "gpt-3.5-turbo";
export const IA_PARAMS = {
	model: IA_MODEL,

	temperature: 0.7,
	max_tokens: MAX_TOKENS,
	top_p: 1,
	presence_penalty: 0.6,
	frequency_penalty: 0.0,
	n: 1,
}
const configuration = /*new Configuration(*/{
	apiKey: auth.openai.key
};

export class Api {
	openai: OpenAI;

  	constructor() {
		this.openai = new OpenAI(configuration);

		this.openai.apiKey = auth.openai.key;
  	}

	async send (messages: any[]): Promise<ApiReply> {
		try {

			 // console.log("Prompting", messages);
			const completion = await this.openai.chat.completions.create({
				...IA_PARAMS,
				messages
			});
			const data = completion.choices[0].message.content;
			return {
				ok: true,
				data
			};

		} catch(error) {

			// Consider adjusting the error handling logic for your use case
			if (error.response) {
				console.error(error.response.status, error.response.data);
				return { ok: false, data: error.response.data.error.message }
			} else {
				console.error(`Error with OpenAI API request: ${error.message}`);
				return { ok: false, data: 'An error occurred during your request.' }
			}

		}
	}
}
