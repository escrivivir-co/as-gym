import { APP_CADENA_i18 } from '../aplicaciones/cadena/cadena-app-i18';
import { ALEPHSCRIPT_i18 } from '../paradigmas/alephscript-i18';
import { AS_APP_IDE_i18 } from '../aplicaciones/ide/semilla/ide-app-i18';

export const i18_ME = {

    ME_LABEL: "sistema",

}

export const i18 = {

    ME_LABEL: i18_ME.ME_LABEL,

    ...ALEPHSCRIPT_i18,

    APPS: {

        ME_LABEL: `app.manager.${i18_ME.ME_LABEL}`,

        START: 'App inicia',
        BODY: 'App ejecutándose',
        END: 'App acaba',

        ...APP_CADENA_i18,
        ...AS_APP_IDE_i18
    }

}
