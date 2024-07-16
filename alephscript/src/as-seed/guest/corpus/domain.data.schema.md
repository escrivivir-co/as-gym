See [devoloper](./developer/) folder to get mock-data generation techniques or suggestions on Generative-IA prompting.

El contenido mock-data modela un Edificio con habitaciones. Dos usuarios tendrán acceso a los muebles en su interior. Y, en ellos, a una lámpara a la que se le puede consultar el estado o interactuar.

Used GPT-4.

The purpose of this corpus is to provide test-mock data for AS Seed [as-seed-importers-structured-data](../../as-importers/) in the form of JSONified sources of entity-relation information models, i.e., SQL databases, or Non-Sql JSON collections.

Basic prompting is provided at developer folder. StructuredData is modeled by [](../../core/model.ts) interface.

Basic dummy set is by default:

- Building >> Rooms >> Fourniture >> Things

Main schema: [domain.data.schema.json](./domain.data.schema.json).

Basic dummy set is by default:

- User >> Roles >> Access to Fourniture
                >> Access to Things

Auth schema: [domain.data.schema.auth.json](./domain.data.schema.auth.json).

## Using AS-FRAMEWORK to build Assistant rasa-like yaml files 

![](../../../../build_info_pics/master-screen-schema.png)

![](../../../../build_info_pics/master-screen-load-data-0-no-init.png)
![](../../../../build_info_pics/master-screen-load-data-1-loaded.png)