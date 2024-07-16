# AS SDK BIM Un enlazador (indice/bosque) para generar CONTEXTO en conversaciones donde la búsqueda devuelve muchos resultados (ejemplo: buscar por "tanque" o por "lámpara")

Caso de uso: **"Quiero saber el estado de la lámpara"**. Tras una búsqueda en el [indice](../../../as-seed/as-importers/tree-loader.ts) se encuentran muchas ocurrencias de "lámpara". Para reducir la búsqueda, [AS SDK BIM Navigator](./navigator.ts) provee el método sintetizar que permite localizar contexto (según una profunidad dada) para ofrecerle al usuario acotar la búsqueda. Una búsqueda por la palabra clave "lámpara" y profundidad 2 devolverá los objetos de nivel 1 y 2 que contengan una lámpara.

## Funcionalidad (precondición)

Cargar los datos de ejemplo y tomar el [índice y el bosque](../../../../AlephScriptApps/out/bundle/Domain_0001.aleph).

- Índice: árbol comprimido como tabla (fk como segmentos). Ver info: [TreeLoader](../../../as-seed/as-importers/tree-loader.ts)
- Bosque: El árbol de datos como grafo.

```ts

    const rt = new RTCache();

    const p = path.join(this.app.baseFolder, this.app.appFolder, "Domain_0001.aleph");
    const source = rt.recuperRuta(p);
    const d = source.domain[0].find(d => d.name == "compressed-tree.json");

```

## Funcionalidad (caso de uso)

Se realiza la búsqueda y se descubre que existen 4 objetos en toda la estructura con la clave introducida por el usuario, i.e. "lámpara".

Se devuelve, según la profundidad, los objetos padre para ofrecer al usuario refinar:

```ts

    // Cargar el navegador
    const n = new NavigatorBIM();
    n.index = d.index;
    n.bosque = d.bosque;

    // Buscar
    console.log("The navigate to \n", "Lámpara", " \n test")
    const r = n.navegarYSintetizar("Lámpara");

    console.log("The navigation result", r.caminosIndex.map(c => c));
    console.log("The navigation result", r.caminos[0].map(c => c));

    console.log("Sintesis", r.sintesis);
```

Los resultados de las búsquedas se almacenan en el directorio de [config.aleph/navigationFolder](./../../../../AlephScriptApps/in/config/config.aleph), por ejemplo, [AlephScriptApps/out/navigation/search1707863794852.aleph)](/Users/morente/Desktop/THEIA_PATH/taller_tc/JE20/je20/fia/AlephScriptApps/out/navigation/search1707863794852.aleph)


### Entrada: Índice

Permite búsquedas rápidas pero no contiene información asociada:

```json
    [
        {
            "type": "Edificio",
            "pk": "Edificio1",
            "data": {
                "nombre": "Edificio Central"
            }
        },
        {
            "type": "Habitacion",
            "pk": "Habitacion101",
            "fk": "Edificio1/Habitacion101/",
            "data": {
                "nombre": "101"
            }
        },
        {
            "type": "Habitacion",
            "pk": "Habitacion102",
            "fk": "Edificio1/Habitacion102/",
            "data": {
                "nombre": "102"
            }
        },
        {
            "type": "Mueble",
            "pk": "Mueble101",
            "fk": "Edificio1/Habitacion101/Mueble101/",
            "data": {
                "nombre": "Mueble A"
            }
        },
        {
            "type": "Mueble",
            "pk": "Mueble102",
            "fk": "Edificio1/Habitacion102/Mueble102/",
            "data": {
                "nombre": "Mueble A"
            }
        },
        {
            "type": "Objeto",
            "pk": "Lampara101A",
            "fk": "Edificio1/Habitacion101/Mueble101/Lampara101A/",
            "data": {
                "nombre": "Lámpara A",
                "estado": "apagado"
            }
        },
        {
            "type": "Accion",
            "pk": "AccionEncender101A",
            "fk": "Edificio1/Habitacion101/Mueble101/Lampara101A/AccionEncender101A/",
            "data": {
                "nombre": "Encender",
                "disponible": true
            }
        },
        {
            "type": "Accion",
            "pk": "AccionApagar101A",
            "fk": "Edificio1/Habitacion101/Mueble101/Lampara101A/AccionApagar101A/",
            "data": {
                "nombre": "Apagar",
                "disponible": true
            }
        },
        {
            "type": "Objeto",
            "pk": "Lampara102A",
            "fk": "Edificio1/Habitacion102/Mueble102/Lampara102A/",
            "data": {
                "nombre": "Lámpara A",
                "estado": "apagado"
            }
        },
        {
            "type": "Accion",
            "pk": "AccionEncender102A",
            "fk": "Edificio1/Habitacion102/Mueble102/Lampara102A/AccionEncender102A/",
            "data": {
                "nombre": "Encender",
                "disponible": true
            }
        },
        {
            "type": "Accion",
            "pk": "AccionApagar102A",
            "fk": "Edificio1/Habitacion102/Mueble102/Lampara102A/AccionApagar102A/",
            "data": {
                "nombre": "Apagar",
                "disponible": true
            }
        },
        {
            "type": "Mueble",
            "pk": "Mueble101B",
            "fk": "Edificio1/Habitacion101/Mueble101B/",
            "data": {
                "nombre": "Mueble B"
            }
        },
        {
            "type": "Objeto",
            "pk": "Lampara101B",
            "fk": "Edificio1/Habitacion101/Mueble101B/Lampara101B/",
            "data": {
                "nombre": "Lámpara B",
                "estado": "apagado"
            }
        },
        {
            "type": "Accion",
            "pk": "AccionEncender101B",
            "fk": "Edificio1/Habitacion101/Mueble101B/Lampara101B/AccionEncender101B/",
            "data": {
                "nombre": "Encender",
                "disponible": true
            }
        },
        {
            "type": "Accion",
            "pk": "AccionApagar101B",
            "fk": "Edificio1/Habitacion101/Mueble101B/Lampara101B/AccionApagar101B/",
            "data": {
                "nombre": "Apagar",
                "disponible": true
            }
        },
        {
            "type": "Mueble",
            "pk": "Mueble102B",
            "fk": "Edificio1/Habitacion102/Mueble102B/",
            "data": {
                "nombre": "Mueble B"
            }
        },
        {
            "type": "Objeto",
            "pk": "Lampara102B",
            "fk": "Edificio1/Habitacion102/Mueble102B/Lampara102B/",
            "data": {
                "nombre": "Lámpara B",
                "estado": "apagado"
            }
        },
        {
            "type": "Accion",
            "pk": "AccionEncender102B",
            "fk": "Edificio1/Habitacion102/Mueble102B/Lampara102B/AccionEncender102B/",
            "data": {
                "nombre": "Encender",
                "disponible": true
            }
        },
        {
            "type": "Accion",
            "pk": "AccionApagar102B",
            "fk": "Edificio1/Habitacion102/Mueble102B/Lampara102B/AccionApagar102B/",
            "data": {
                "nombre": "Apagar",
                "disponible": true
            }
        }
    ]
```

### Entrada: Árbol 


```json
{
    "pk": "Base",
    "data": {},
    "hijos": [
        {
            "pk": "Edificio1",
            "data": {
                "nombre": "Edificio Central"
            },
            "hijos": [
                {
                    "pk": "Habitacion101",
                    "data": {
                        "nombre": "101"
                    },
                    "hijos": [
                        {
                            "pk": "Mueble101",
                            "data": {
                                "nombre": "Mueble A"
                            },
                            "hijos": [
                                {
                                    "pk": "Lampara101A",
                                    "data": {
                                        "nombre": "Lámpara A",
                                        "estado": "apagado"
                                    },
                                    "hijos": [
                                        {
                                            "pk": "AccionEncender101A",
                                            "data": {
                                                "nombre": "Encender",
                                                "disponible": true
                                            },
                                            "hijos": []
                                        },
                                        {
                                            "pk": "AccionApagar101A",
                                            "data": {
                                                "nombre": "Apagar",
                                                "disponible": true
                                            },
                                            "hijos": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "pk": "Mueble101B",
                            "data": {
                                "nombre": "Mueble B"
                            },
                            "hijos": [
                                {
                                    "pk": "Lampara101B",
                                    "data": {
                                        "nombre": "Lámpara B",
                                        "estado": "apagado"
                                    },
                                    "hijos": [
                                        {
                                            "pk": "AccionEncender101B",
                                            "data": {
                                                "nombre": "Encender",
                                                "disponible": true
                                            },
                                            "hijos": []
                                        },
                                        {
                                            "pk": "AccionApagar101B",
                                            "data": {
                                                "nombre": "Apagar",
                                                "disponible": true
                                            },
                                            "hijos": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "pk": "Habitacion102",
                    "data": {
                        "nombre": "102"
                    },
                    "hijos": [
                        {
                            "pk": "Mueble102",
                            "data": {
                                "nombre": "Mueble A"
                            },
                            "hijos": [
                                {
                                    "pk": "Lampara102A",
                                    "data": {
                                        "nombre": "Lámpara A",
                                        "estado": "apagado"
                                    },
                                    "hijos": [
                                        {
                                            "pk": "AccionEncender102A",
                                            "data": {
                                                "nombre": "Encender",
                                                "disponible": true
                                            },
                                            "hijos": []
                                        },
                                        {
                                            "pk": "AccionApagar102A",
                                            "data": {
                                                "nombre": "Apagar",
                                                "disponible": true
                                            },
                                            "hijos": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "pk": "Mueble102B",
                            "data": {
                                "nombre": "Mueble B"
                            },
                            "hijos": [
                                {
                                    "pk": "Lampara102B",
                                    "data": {
                                        "nombre": "Lámpara B",
                                        "estado": "apagado"
                                    },
                                    "hijos": [
                                        {
                                            "pk": "AccionEncender102B",
                                            "data": {
                                                "nombre": "Encender",
                                                "disponible": true
                                            },
                                            "hijos": []
                                        },
                                        {
                                            "pk": "AccionApagar102B",
                                            "data": {
                                                "nombre": "Apagar",
                                                "disponible": true
                                            },
                                            "hijos": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
```

### Salida: Ocurrencias

Resultados de contexto, claves fk por segmentos de caminos al objeto "lámpara":

```json
    [
		"Edificio1/Habitacion101/Mueble101/Lampara101A/",
		"Edificio1/Habitacion102/Mueble102/Lampara102A/",
		"Edificio1/Habitacion101/Mueble101B/Lampara101B/",
		"Edificio1/Habitacion102/Mueble102B/Lampara102B/"
	]
```

Resultados de la búsqueda en el índice:

```json
    [
		{
			"type": "Objeto",
			"pk": "Lampara101A",
			"fk": "Edificio1/Habitacion101/Mueble101/Lampara101A/",
			"data": {
				"nombre": "Lámpara A",
				"estado": "apagado"
			}
		},
		{
			"type": "Objeto",
			"pk": "Lampara102A",
			"fk": "Edificio1/Habitacion102/Mueble102/Lampara102A/",
			"data": {
				"nombre": "Lámpara A",
				"estado": "apagado"
			}
		},
		{
			"type": "Objeto",
			"pk": "Lampara101B",
			"fk": "Edificio1/Habitacion101/Mueble101B/Lampara101B/",
			"data": {
				"nombre": "Lámpara B",
				"estado": "apagado"
			}
		},
		{
			"type": "Objeto",
			"pk": "Lampara102B",
			"fk": "Edificio1/Habitacion102/Mueble102B/Lampara102B/",
			"data": {
				"nombre": "Lámpara B",
				"estado": "apagado"
			}
		}
	]
```


### Salida: Contexto

Cribado parametrizable que dará tantos objetos como se indique la profunidad:

```json
	"sintesis": [
		{
			"pk": "Edificio1",
			"data": {
				"nombre": "Edificio Central"
			},
			"hijos": [
				{
					"pk": "Habitacion101",
					"data": {
						"nombre": "101"
					},
					"hijos": [
						{
							"pk": "Mueble101",
							"data": {
								"nombre": "Mueble A"
							},
							"hijos": [
								{
									"pk": "Lampara101A",
									"data": {
										"nombre": "Lámpara A",
										"estado": "apagado"
									},
									"hijos": [
										{
											"pk": "AccionEncender101A",
											"data": {
												"nombre": "Encender",
												"disponible": true
											},
											"hijos": []
										},
										{
											"pk": "AccionApagar101A",
											"data": {
												"nombre": "Apagar",
												"disponible": true
											},
											"hijos": []
										}
									]
								}
							]
						},
						{
							"pk": "Mueble101B",
							"data": {
								"nombre": "Mueble B"
							},
							"hijos": [
								{
									"pk": "Lampara101B",
									"data": {
										"nombre": "Lámpara B",
										"estado": "apagado"
									},
									"hijos": [
										{
											"pk": "AccionEncender101B",
											"data": {
												"nombre": "Encender",
												"disponible": true
											},
											"hijos": []
										},
										{
											"pk": "AccionApagar101B",
											"data": {
												"nombre": "Apagar",
												"disponible": true
											},
											"hijos": []
										}
									]
								}
							]
						}
					]
				},
				{
					"pk": "Habitacion102",
					"data": {
						"nombre": "102"
					},
					"hijos": [
						{
							"pk": "Mueble102",
							"data": {
								"nombre": "Mueble A"
							},
							"hijos": [
								{
									"pk": "Lampara102A",
									"data": {
										"nombre": "Lámpara A",
										"estado": "apagado"
									},
									"hijos": [
										{
											"pk": "AccionEncender102A",
											"data": {
												"nombre": "Encender",
												"disponible": true
											},
											"hijos": []
										},
										{
											"pk": "AccionApagar102A",
											"data": {
												"nombre": "Apagar",
												"disponible": true
											},
											"hijos": []
										}
									]
								}
							]
						},
						{
							"pk": "Mueble102B",
							"data": {
								"nombre": "Mueble B"
							},
							"hijos": [
								{
									"pk": "Lampara102B",
									"data": {
										"nombre": "Lámpara B",
										"estado": "apagado"
									},
									"hijos": [
										{
											"pk": "AccionEncender102B",
											"data": {
												"nombre": "Encender",
												"disponible": true
											},
											"hijos": []
										},
										{
											"pk": "AccionApagar102B",
											"data": {
												"nombre": "Apagar",
												"disponible": true
											},
											"hijos": []
										}
									]
								}
							]
						}
					]
				}
			]
		},
		{
			"pk": "Habitacion101",
			"data": {
				"nombre": "101"
			},
			"hijos": [
				{
					"pk": "Mueble101",
					"data": {
						"nombre": "Mueble A"
					},
					"hijos": [
						{
							"pk": "Lampara101A",
							"data": {
								"nombre": "Lámpara A",
								"estado": "apagado"
							},
							"hijos": [
								{
									"pk": "AccionEncender101A",
									"data": {
										"nombre": "Encender",
										"disponible": true
									},
									"hijos": []
								},
								{
									"pk": "AccionApagar101A",
									"data": {
										"nombre": "Apagar",
										"disponible": true
									},
									"hijos": []
								}
							]
						}
					]
				},
				{
					"pk": "Mueble101B",
					"data": {
						"nombre": "Mueble B"
					},
					"hijos": [
						{
							"pk": "Lampara101B",
							"data": {
								"nombre": "Lámpara B",
								"estado": "apagado"
							},
							"hijos": [
								{
									"pk": "AccionEncender101B",
									"data": {
										"nombre": "Encender",
										"disponible": true
									},
									"hijos": []
								},
								{
									"pk": "AccionApagar101B",
									"data": {
										"nombre": "Apagar",
										"disponible": true
									},
									"hijos": []
								}
							]
						}
					]
				}
			]
		},
		{
			"pk": "Habitacion102",
			"data": {
				"nombre": "102"
			},
			"hijos": [
				{
					"pk": "Mueble102",
					"data": {
						"nombre": "Mueble A"
					},
					"hijos": [
						{
							"pk": "Lampara102A",
							"data": {
								"nombre": "Lámpara A",
								"estado": "apagado"
							},
							"hijos": [
								{
									"pk": "AccionEncender102A",
									"data": {
										"nombre": "Encender",
										"disponible": true
									},
									"hijos": []
								},
								{
									"pk": "AccionApagar102A",
									"data": {
										"nombre": "Apagar",
										"disponible": true
									},
									"hijos": []
								}
							]
						}
					]
				},
				{
					"pk": "Mueble102B",
					"data": {
						"nombre": "Mueble B"
					},
					"hijos": [
						{
							"pk": "Lampara102B",
							"data": {
								"nombre": "Lámpara B",
								"estado": "apagado"
							},
							"hijos": [
								{
									"pk": "AccionEncender102B",
									"data": {
										"nombre": "Encender",
										"disponible": true
									},
									"hijos": []
								},
								{
									"pk": "AccionApagar102B",
									"data": {
										"nombre": "Apagar",
										"disponible": true
									},
									"hijos": []
								}
							]
						}
					]
				}
			]
		}
	]
```