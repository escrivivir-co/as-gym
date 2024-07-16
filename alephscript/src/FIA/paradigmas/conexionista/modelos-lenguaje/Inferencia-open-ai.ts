import { IBaseConocimiento } from "../../../mundos/base-conocimiento";
import { Dominio, IDominio } from "../../../mundos/dominio";
import { InferenciaModeloLenguaje } from "./inferencia-modelo-lenguaje";
import { Api, ApiState } from "./oai/api";
import { PromptBase } from "./inferencia-oai";

export enum ChatCompletionRequestMessageRoleEnum {
    System = 'system',
    User = 'user',
    Assistant = 'assistant'
}

export class InferenciaOpenAI<T> extends InferenciaModeloLenguaje<T> {

    static occupy = 0;

    mensajes: T[];
    api: Api = new Api();

    constructor() {
        super();
        this.dominio = new Dominio({});
    }

    claveDominio = "inferencias.openai";

    configurar(b: IBaseConocimiento, parametros: IDominio): void {

        // console.log(agentMessage('InferenciaOpenAI.evaluar', 'configurar base'), b);
        this.mensajes = this.obtenerPromptBase(b, parametros.base as unknown as PromptBase);
    }

    obtenerPromptBase(b: IBaseConocimiento, datos: PromptBase): T[] {
        const roles = ChatCompletionRequestMessageRoleEnum;
        return [
            { role: roles.System, content: datos.system.background },
            { role: roles.System, content: datos.system.format },

            { role: roles.Assistant, content: datos.assistant.cache },
            { role: roles.Assistant, content: datos.assistant.archive },

            { role: roles.User, content: datos.user.analytics },
            { role: roles.User, content: datos.user.prompt.replace("<estado.modelo>", JSON.stringify((b as ApiState).modelo)) }
        ] as T[];
    }

    async evaluar(): Promise<InferenciaModeloLenguaje<T>> {

        // this.dominio.base[this.claveDominio] = [ 'Correcto' ];
        // return this;

        if (InferenciaOpenAI.occupy == 50) {
            process.exit();
            console.log("Cancelando request openai");
            return this;

        }

        this.dominio.base[this.claveDominio] = {
            respuesta: "Todo bien."
        }
        //return this;
        InferenciaOpenAI.occupy++;
        const response = await this.queryToApi();
        // console.log(agentMessage('InferenciaOpenAI.evaluar', 'raw api response:'), response?.result);

        try {
            this.dominio.base[this.claveDominio] = JSON
                .parse(response.result.replace(/\\n/g, ""));
        } catch (ex) {
            this.dominio.base[this.claveDominio] = response;
        }

        // console.log("oai.the domain now has value", this.dominio.base[this.claveDominio]);
        return this;

    }

    async queryToApi(): Promise<{ result: string; }> {

        let result;
        /* console.log(
            agentMessage('InferenciaOpenAI.evaluar', 'raw api request:'),
            this.mensajes.map(m => (m as IOpenAiApiMessage).content)
        ); */

        const completion = await this.api.send(this.mensajes);
        if (completion.ok) {
            result = { result: completion.data };
        } else {
            result = { result: 'An error occurred during your request.' };
        }
        return result;

    }
}
