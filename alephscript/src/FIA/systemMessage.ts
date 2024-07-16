import { i18 } from "./i18/aleph-script-i18";


export function systemMessage(message: string) {
    return `${i18.ME_LABEL}> ${message}`;
}
