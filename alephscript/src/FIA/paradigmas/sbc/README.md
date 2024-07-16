# Sistemas basados en Conocimiento SBC

Desde el punto de vista de la ingeniería del conocimiento, se investigará la implementación de [SBC](./fia-sbc.ts)s: sistemas basados en conocimiento, por ejemplo: [CommonKADS](./implementaciones/common-kads/) para el desarrollo de [sistemas](./implementaciones/common-kads/sistema.ts) y [aplicaciones](./modelos/disenyo/aplicacion.ts) que corran las FIAs.

Por ejemplo:

- [CommonKADS](./modelos/common-kads/): [commonkads.fnwi.uva.nl](https://commonkads.fnwi.uva.nl/) es evolución de KADS: Knowledge Acquisition and Design Structuring.


# Logs

Arranque de la [FIA Sistema Basado Conocimiento](fia-sbc.ts) que creará una [FIA_SBC_CK](./implementaciones/common-kads/fia-sbc-ck.ts) específica para CommonKADS:

```
sistema> Transfiriendo el prompt a: fia.sbc
fia.sbc> Lanzando un sistema basado en conocimiento de tipo CommonKADS...
fia.sbc.common.kads> Hola, voy a generar un app siguiendo la metodología Common KADS. 3..., 2..., 1..., ¡lanzando!
```

La [FIA_SBC_CK](./implementaciones/common-kads/fia-sbc-ck.ts) arranca su gestor [CommonKADS](./implementaciones/common-kads/common-kads.ts):

```
common.kads> Ejecutaré 3 fases de construcción. Y, a continuación, monitorizaré la aplicación derivada. ¡Vamos!
```

[Nivel Contexual](./implementaciones/common-kads/nivel/nivel-contextual.ts):

```
common.kads> Realizado estudio de viabilidad:
            - OM-1:[<Modelo Vacío>]
            - OM-2:[<Modelo Vacío>]
            - OM-3:[<Modelo Vacío>]
            - OM-4:[<Modelo Vacío>]
            - OM-5:[<Modelo Vacío>]
common.kads>  Realizado estudio de impacto y mejoras:
            - TM-1:[<Modelo Vacío>]
            - TM-2:[<Modelo Vacío>],
            - AM-1:[<Modelo Vacío>]
common.kads> Período de construcción. Acabada fase: Nivel Contextual.
            - OTA-1:[<Modelo Vacío> - OM-1 - OM-2 - OM-3 - OM-4 - OM-5 - TM-1 - TM-2 - AM-1]
```

[Nivel Conceptual](./implementaciones/common-kads/nivel/nivel-conceptual.ts):

```
common.kads> Realizado modelo de conocimiento:
            - KM-1:[<Modelo Vacío>], UML, CML.
common.kads> Realizado modelo de comunicaciones:
            - CM-1:[<Modelo Vacío>]
            - CM-2:[<Modelo Vacío>]
common.kads> ¡Especificación realizada!
common.kads> Período de construcción. Acabada fase: Nivel Conceptual.
```

[Nivel Artefactual](./implementaciones/common-kads/nivel/nivel-artefactual.ts):

```
common.kads> Nivel Artefactual:
            - DM-1:[ -  -  - ]
            - DM-2:[ -  -  - ]
            - DM-3:[ -  -  - ]
            - DM-4:[ -  -  - ].
common.kads> Período de construcción. Acabada fase: Nivel Artefactual.
```

[Ejecución del sistema](./implementaciones/common-kads/sistema.ts):

```
common.kads> ¡Sistema resultante! Ejecutándolo...
common.kads.sistema> ¡Arranque!
common.kads.sistema.app> ¡App arranca!
common.kads.sistema.app> ¡App deposición!
common.kads.sistema> ¡Deposición!
common.kads> Deposición del sistema.
fia.sbc.common.kads> ¡Finalizado!
fia.sbc> ¡Cerrando SBC!
fia.sbc> nombre: <Modelo Vacío>
		 -dominio: {"base":{"start":"2023-11-08T03:25:28.881Z","end":"2023-11-08T03:25:28.881Z"}}
```