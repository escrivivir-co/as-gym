export const CADENA_DOMINIO_i18 = {

    DOMINIO: {

        ENTIDADES: {
            tarea: "tarea",
            robot: "robot",
            objeto: "objeto",
            propiedad: "propiedad",
            cadena: "cadena",
            almacen: "almacen",
        },
        ARCOS: {
            DESCRIPTIVOS: {
                tarea_cadena_robot_objeto_almacen: {
                    parametros: {
                        tarea: "",
                        cadena: "",
                        robot: "",
                        objeto: "",
                        almacen: ""
                    },
                    desencadenar: "Tarea: <clave>. Agente <robot>: <tarea> <objeto> entre <almacen> y <cadena>.",
                    encadenar: "Tarea: <clave>. Agente <robot>: <tarea> <objeto> entre <almacen> y <cadena>."
                },
                tarea_robot_objeto_almacen:  {
                    parametros: {
                        robot: "",
                        objeto: "",
                        almacen: ""
                    },
                    deshechar: "Tarea: <clave>. Agente <robot>: <tarea>: <objeto> al lugar <almacen>.",
                },
                tarea_robot_objeto_propiedad:  {
                    parametros: {
                        robot: "",
                        objeto: "",
                        propiedad: ""
                    },
                    operar: "Tarea: <clave>. Agente <robot>: <tarea>: <propiedad> de <objeto>",
                }
            },
            ESTRUCTURALES: {
                INSTANCIA: {
                    texto: "<clave> es instancia de <valor>",

                    cadena_1: { cadena: "cadena" },

                    almacen_1: { almacen: "almacen" },

                    entrada1: { almacen: "almacen" },
                    salida1: { almacen: "almacen" },
                    basura1: { almacen: "almacen"},

                    reponedor1: { reponedor: "reponedor"},

                    robot_1: { criptoselladora: "criptoselladora"},
                    robot_2: { criptoselladora: "criptoselladora"},

                    robot_3: { parseadora: "parseadora"},
                    robot_4: { parseadora: "parseadora"},

                    objeto_1: { objeto_parseable: "objeto_parseable"},
                    objeto_2: { objeto_criptosellable: "objeto_criptosellable"},
                    objeto_3: { objeto_parseable: "objeto_parseable"},
                    objeto_4: { objeto_compuesto: "objeto_compuesto"},

                },
                PARTE: {
                    texto: "<clave> tiene la parte: <valor>",
                    robot: {
                        tarea_cadena_robot_objeto: "tarea",
                        tarea_robot_objeto: "tarea",
                        tarea_robot_objeto_propiedad: "tarea",
                    },
                    objeto: {
                        propiedad: "propiedad"
                    },
                    objeto_criptosellable: {
                        propiedad_criptosellable: { propiedad: "propiedad"}
                    },
                    objeto_parseable: {
                        propiedad_parseable: { propiedad: "propiedad" }
                    },
                    objeto_compuesto: {
                        objeto_criptosellable: "objeto",
                        objeto_parseable: "objeto"
                    }
                },
                SUBCLASE: {
                    texto: "<clave> es subclase de <valor>",

                    cadena: { robot: "robot" },

                    reponedor: { robot: "robot" },
                    criptoselladora: { robot: "robot" },
                    parseadora: { robot: "robot" },

                    objeto_criptosellable: { objeto: "objeto" },
                    objeto_parseable: { objeto: "objeto" },
                    propiedad_criptosellable: { propiedad: "propiedad"},
                    propiedad_parseable: { propiedad: "propiedad" },


                    propiedad_cripta: { propiedad_criptosellable: "propiedad"},
                    propiedad_cadena: { propiedad_parseable: "propiedad"},
                    propiedad_estado: { propiedad: "propiedad" }
                }
            }
        }
    }

}