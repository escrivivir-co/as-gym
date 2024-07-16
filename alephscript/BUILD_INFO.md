# AlephScript Bundle

## AS Seed

![](build_info_pics/as-fk-ui-flow5.png)



It is a **npm-package-library** for npm-apps over NodeJs. It allows to create "seeds" for AlephScript Apps.

An App is exportable like a bundle with CommonKADS forms, using JSON format.

This library provides tools to parse or cast entity-relation models or non-sql collections under JSON schema.

It also allows to manage collections of anotated data to train the NLU/NLG engines.

## AS Framework

It is **HMTL5/nodejs website node** that imports CommonKADS forms and converts them into AlephScript Apps. An App is library of YAML (RASA-like) model domain files defined by a semantic-network and a protocol of frames that link together user roles (an its authorized permission access to resources or interaction) with domain object model.

AS Framework provides AS IDE to wire together application logic (node-red under the hoods) with half-non-code editors, wiring that must be translated and compiled to YAML files by AS Compiler.

## AS Runtime

It is a **Docker cluster** that allow launching of AlephScript Apps and bundling them together in a System (Rasa Opensource and OpenIA Assistant API over the hoods). Authentication will provide authorization JWT Tokens to grant access either to resources info or manipulation.

AlephScript provides a superset of Role management to link context units between breakpoints or sessions all over the cluster.

## AS SDKs

They are **npm-package-libraries** to provide drivers and bridging with expert informational systems when using AS Framework to build AlephScript Apps.

## AS SDKs BIM Interface

It is a Typescript superset kit that allows matching 3D worlds by browsing vertical or horizontal in its tree together with artificial conversational assistants. Can work linked to a BIM 3D Viewer website (will receive context state) or context independant from a Chat Room.

This SDK allows to nest in a system many AlephScript Apps to map Building information model like a DOM (domain object model) on 3D worlds. Allowing to map user roles over domain sections and to manage operations over any SCADA App present in the current location for current user.

## AS SDKs SCADA Interface

It is a Typescript superset kit that allows matching monitoring and desking of machine signaling (sensor/actuators) linking SCADA boards with artificial conversational assistants. Can work linked to a SCADA dashboard website (will receive context state) or context independant from a Chat Room.

This SDK allows to map monitoring and desking of machines to be consumed (or not, standalone) in AlephScript BIM Apps as a part of the world content.

# AlephScript Bundle


## AS Seed Admin Project designer: Load Structured Data

![](build_info_pics/as-fk-ui-flow6.png)


## AS Seed Admin Project designer: "Do the CommonKADS app creation assisted flow"

### Contextual Level

![](build_info_pics/as-fk-ui-flow4.png)

### IA (Conversational) assisted KADS loop

![](build_info_pics/as-fk-ui-flow3.png)

### OTA-1 FORM

![](build_info_pics/as-fk-ui-flow2.png)

### Application bundle project file

![](build_info_pics/as-fk-ui-flow1.png)

## AS Seed Admin Project designer: Compile and bundle to YAML Rasa Stories libraries

pending


## AS Seed

[](src/as-seed)

![](./build_info_pics/AS_SEED.png)

```
sistema> Arrancando el sistema
AS_SEED: main sequence
AS_SEED: main sequence.Init
Creating app folder {
  id: 'BoilerPlateApp',
  baseFolder: 'AlephScriptApps',
  configFolder: 'in/config'
}
Consuming config files
         - Read config folder AlephScriptApps/in/config
         - Read file config.aleph
         - Applying config file 0 config.aleph {
  id: 'BoilerPlateApp',
  baseFolder: 'AlephScriptApps',
  configFolder: 'in/config',
  chensFolder: 'in/chen',
  collectionsFolder: 'in/nonsql',
  dataFolder: 'in/data',
  appFolder: 'out/bundle'
}
Opened seed!
AS_SEED: main sequence. Loading source files
         - Loading source files. Found chen files: 0
         - Loading source files. Found collection file: 0
         - Loading source files. Found data file: 0
Executing loaders:
         - Executing loaders. Loaded chen domains: 0
                 - Loader for file in/chen
         - Executing loaders. Loaded collection domains: 0
                 - Loader for file in/nonsql
         - Executing loaders. Loaded chen domains: 0
                 - Loader for file in/data
         - Write AlephScriptApps/out/bundle/Domain_0001.aleph
Readed file [ 'Network 0 --> ,,' ]
         - STORE logs 0 {
  build: { timestamp: 2024-02-11T00:54:19.408Z, app: 'BoilerPlateApp' },
  state: 200,
  error: 'Stored'
}
AS_SEED: main sequence. Training...
         - trained! {
  id: 'NotInitedModel',
  domain: [],
  commonKADSforms: AppCommonKADS { forms: [] }
}
AS_SEED: main sequence. Compiling...
Writing target AlephScriptApps/out/bundle/Build_0001.aleph
Readed file { id: 'NotInitedModel', domain: [], commonKADSforms: { forms: [] } }
         - Compilation logs 0 {
  build: {
    timestamp: 2024-02-11T00:54:19.411Z,
    app: 'BoilerPlateApp',
    model: 'NotInitedModel'
  },
  state: 200,
  error: 'Compiled'
}

```

## AS Framework

### AS Framework Node-Red instance

[](src/as-framework)

![](./build_info_pics/AS_FRAMEWORK.png)

![](./build_info_pics/AS_FRAMEWORK_1.png)

![](./build_info_pics/AS_FRAMEWORK_WIRED.png)

![](./build_info_pics/AS_FRAMEWORK_LOOP.png)

![](./build_info_pics/master-screen-schema.png)

![](./build_info_pics/developer-screen-schema.png)

![](./build_info_pics/operator-screen-schema.png)

## AS Runtime

[](src/as-runtime)

![](./build_info_pics/AS_RUNTIME_1.png)
![](./build_info_pics/AS_RUNTIME.png)

## AS SDKs

[](src/as-sdks)


## AS SDKs BIM Interface

[](src/as-sdks/bim)


## AS SDKs SCADA Interface

[](src/as-sdks/scada)


## Using AS-FRAMEWORK to build Assistant rasa-like yaml files 

![](./build_info_pics/master-screen-schema.png)

![](./build_info_pics/master-screen-load-data-0-no-init.png)
![](./build_info_pics/master-screen-load-data-1-loaded.png)

## COMING  AlephScript Framework IDE server

[FIA/aplicaciones/ide](./src/FIA/aplicaciones/ide/semilla/README.md)

# Sistemas basados en Conocimiento SBC

[./src/FIA/paradigmas/sbc/README.md](./src/FIA/paradigmas/sbc/README.md)
