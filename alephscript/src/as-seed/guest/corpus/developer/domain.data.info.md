# Objetivo: to generated mock data for entity-relation JSON domain schemas

Produce mocked sample of BIM/Scada domains. Those mock data simulate real or possible system information models that requires an implementation of AI Assistance by AlephScript.

Import this mock data to model the Assistants network for specific BIM/SCADA interfaces.

## Collection/Tree format

Toma el rol de un asistene de código. Activa el modo json. Genera un juego de pruebas mock. Crea ocurrencias para la entidad IModel para la modelización de un edificio: 

- un edificio tiene habitaciones
- las habitaciones tienen muebles
- un mueble tiene compartimentos

...  a partir de la siguiente definición typescript:

```ts
export type IType = any;

export interface IData extends IType {
}

export interface IRowData extends IRow {
    data: IData;
}

export interface IRowFK extends IRow {
}

export interface IRowPK extends IRow {
}

export interface IRow {
}

export interface IModel {
    id: ID;

    rows: IRow[];
}

export class Model implements IModel {

    id: ID = "NotInitedModel";

    rows = [];
}

export type ID = any;
```

Genera: [domain.data.tree.json](./domain.data.tree.json).


## Chenified

Genera otro juego de pruebas consistente en un único objeto Model en cuyas rows se cargan edificios, habitaciones, muebles y cosas. Representando un modelo entidad-relación, usa las interfaces IRow (FK, PK) para establecer correspondencias foreign, primary key.

Genera: [domain.data.tree.json](./domain.data.relational.json).

## SCADA Interface

Regenera el json anterior agregando a la lámapara del Mueble1 la posibilidad de:
- Saber si está encendida o apagada
- encenderla
- apagarla

Debe modelizarse como otra fila de IRow usando relaciones FK.

Genera: [domain.data.relational.scada.json](./domain.data.relational.scada.json).

## BIM Interface

Regenera el json anterior agregando a la lámapara del Mueble1 la posibilidad de:
- Saber si está encendida o apagada
- encenderla
- apagarla

Debe modelizarse como otra fila de IRow usando relaciones FK.

Genera: [domain.data.relational.scada.json](./domain.data.relational.scada.json).

## Generating AlephScript mock data for entity-relation information models

Vamos a llamar al fichero json que modelaba el edificio domain.data.schema.json y a este último domain.data.schema.auth.json, ¿puedes regenerar el primero para que las claves fk usadas en el segundo tengan relación?

Genera: [domain.data.schema.json](./domain.data.schema.json).
Genera: [domain.data.schema.auth.json](./domain.data.schema.auth.json).


## Adding SCADA actions role auth

Crea otra versión de domain.data.schema.auth.json que agregue permisos para encender o apagar las lámaparas mediante las Acciones.

Genera: [domain.relational.scada.auth.json](./domain.relational.scada.auth.json).