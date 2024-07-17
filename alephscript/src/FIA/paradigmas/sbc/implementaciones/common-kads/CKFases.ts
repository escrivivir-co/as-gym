import { AS_COMMON_KADS_I18 } from "./as-common-kads-i18";


export const fi18 = AS_COMMON_KADS_I18.COMMON_KADS.CK;
export enum CKFases {
	Nivel = "",
	NivelContextual = fi18.FASES.CONTEXTUAL.NOMBRE as any,
	NivelConceptual = fi18.FASES.CONCEPTUAL.NOMBRE as any,
	NivelArtefactual = fi18.FASES.DISENYO.NOMBRE as any,
	Monitorizacion = fi18.EJECUCION.NOMBRE as any
}

export enum CKFases2 {
	Nivel = "",
	NivelContextual = "Nivel Contextual",
	NivelConceptual = "NivelConceptual",
	NivelArtefactual = "NivelArtefactual",
	Monitorizacion = "Monitorizacion"
}
