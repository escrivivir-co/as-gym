// Enumeración para las estaciones del anyo
enum Estacion {
	Invierno = "Invierno",
	Primavera = "Primavera",
	Verano = "Verano",
	Otonyo = "Otonyo"
  }

  // Enumeración para los estados de la jornada diaria
  enum EstadoJornada {
	Inicio = "Inicio",
	Transacciones = "Transacciones",
	Final = "Final"
  }

  // Enumeración para los estados globales del mundo
  enum EstadoMundo {
	Invierno = "Invierno",
	Primavera = "Primavera",
	Verano = "Verano",
	Otonyo = "Otonyo"
  }

  // Enumeración para las fases de la DAO-Cultivo (Agricultor)
  enum FaseCultivo {
	Siembra = "Siembra",
	Crecimiento = "Crecimiento",
	Recoleccion = "Recolección",
	Ensacado = "Ensacado"
  }

  // Enumeración para las fases de la DAO-Molienda (Molineros)
  enum FaseMolienda {
	Molienda = "Molienda",
	AlmacenamientoHarina = "Almacenamiento Harina"
  }

  // Enumeración para las fases de la DAO-Panadería (Panaderos)
  enum FasePanaderia {
	Horneado = "Horneado",
	DistribucionPan = "Distribución Pan"
  }

  // Enumeración para las fases de la DAO-Almacén
  enum FaseAlmacen {
	Recepcion = "Recepción",
	Almacenamiento = "Almacenamiento",
	Distribucion = "Distribución"
  }




interface Modelo {
	nombre: string;
	ciclo_de_vida: CicloDeVida[];
 }

interface CicloDeVida {
	evento: string;
	descripcion: string;
	smart_contract: string;
	accion: string;
}

interface Tarea {
	nombre: string;
	descripcion: string;
	responsables: string[];
	token_gobernanza: number;
	contrato: string;
}

interface SmartContract {
	nombre: string;
	descripcion: string;
	codigo: string;
}

interface Agente {
	nombre: string;
	ssb_id: string;
	cartera_ethereum: string;
	DAO: string | string[];  // Puede pertenecer a una o varias DAOs
}

interface Interaccion {
	evento: string;
	descripcion: string;
	smart_contract: string;
	accion: string;
}

const DAOs = [
	{
	  "nombre": "DAO-Cultivo",
	  "descripcion": "Gestión del cultivo de trigo para la producción de pan.",
	  "tareas": [
		{
		  "nombre": "Cultivar trigo",
		  "descripcion": "Cultivar y mantener el trigo para la producción.",
		  "responsables": ["agricultores"],
		  "token_gobernanza": 1000,
		  "contrato": "cultivo_smart_contract"
		},
		{
		  "nombre": "Recolección de trigo",
		  "descripcion": "Recolectar el trigo y prepararlo para ser procesado.",
		  "responsables": ["agricultores"],
		  "token_gobernanza": 500,
		  "contrato": "recoleccion_smart_contract"
		}
	  ],
	  "smart_contracts": [
		{
		  "nombre": "cultivo_smart_contract",
		  "descripcion": "Contrato inteligente para gestionar la asignación de recursos y pagos a los agricultores.",
		  "codigo": "cultivoSC.sol"
		},
		{
		  "nombre": "recoleccion_smart_contract",
		  "descripcion": "Contrato inteligente para la recolección y procesamiento del trigo.",
		  "codigo": "recoleccionSC.sol"
		}
	  ]
	},
	{
	  "nombre": "DAO-Molienda",
	  "descripcion": "Gestión de la molienda y procesamiento del trigo.",
	  "tareas": [
		{
		  "nombre": "Moler trigo",
		  "descripcion": "Convertir el trigo recolectado en harina.",
		  "responsables": ["molineros"],
		  "token_gobernanza": 800,
		  "contrato": "molienda_smart_contract"
		},
		{
		  "nombre": "Distribución de harina",
		  "descripcion": "Distribuir la harina a las panaderías.",
		  "responsables": ["molineros", "transportistas"],
		  "token_gobernanza": 400,
		  "contrato": "distribucion_smart_contract"
		}
	  ],
	  "smart_contracts": [
		{
		  "nombre": "molienda_smart_contract",
		  "descripcion": "Contrato para la asignación de recursos en la molienda.",
		  "codigo": "moliendaSC.sol"
		},
		{
		  "nombre": "distribucion_smart_contract",
		  "descripcion": "Contrato inteligente para la distribución de la harina.",
		  "codigo": "distribucionSC.sol"
		}
	  ]
	},
	{
	  "nombre": "DAO-Panaderia",
	  "descripcion": "Gestión del horneado y entrega del pan.",
	  "tareas": [
		{
		  "nombre": "Hornear pan",
		  "descripcion": "Hornear el pan con la harina distribuida.",
		  "responsables": ["panaderos"],
		  "token_gobernanza": 1200,
		  "contrato": "horneado_smart_contract"
		},
		{
		  "nombre": "Entrega de pan",
		  "descripcion": "Entregar el pan a la comunidad.",
		  "responsables": ["transportistas"],
		  "token_gobernanza": 600,
		  "contrato": "entrega_smart_contract"
		}
	  ],
	  "smart_contracts": [
		{
		  "nombre": "horneado_smart_contract",
		  "descripcion": "Contrato para la gestión de recursos y compensaciones para los panaderos.",
		  "codigo": "horneadoSC.sol"
		},
		{
		  "nombre": "entrega_smart_contract",
		  "descripcion": "Contrato para la gestión de la entrega del pan.",
		  "codigo": "entregaSC.sol"
		}
	  ]
	}
  ]
const comunidad = {
	"nombre": "GlobalVillagePan",
	"miembros": 50,
	DAOs
}

const interacciones = [
	{
		"evento": "Distribuir renta universal",
		"descripcion": "Al comienzo de la jornada, cada miembro recibe una renta universal en tokens.",
		"smart_contract": "renta_basica_smart_contract",
		"accion": "Distribuir tokens a cada miembro"
	  },
	  {
		"evento": "Votación de nuevas propuestas",
		"descripcion": "Los miembros votan en cada DAO para decidir sobre proyectos, asignación de recursos, etc.",
		"smart_contract": "votacion_smart_contract",
		"accion": "Registrar votos y ejecutar decisiones"
	  },
	  {
		"evento": "Pago de recompensas por tareas",
		"descripcion": "Recompensas en tokens distribuidas a los miembros por completar tareas.",
		"smart_contract": "recompensa_smart_contract",
		"accion": "Transferencia de tokens a los responsables de tareas"
	  },
	  {
		"evento": "Distribución de intereses a ahorradores",
		"descripcion": "Los ahorradores reciben intereses por los tokens guardados en su cartera.",
		"smart_contract": "interes_smart_contract",
		"accion": "Cálculo y distribución de intereses"
	  }
]
const ciudadano = {
	"modelo": "Ciudadano",
	"agente": {
	  "nombre": "ciudadano_1",
	  "ssb_id": "ciudadano12345",
	  "cartera_ethereum": "0xxyz123..."
	},
	"ciclo_de_vida": [
	  {
		"evento": "Recepción de renta básica",
		"descripcion": "El ciudadano recibe tokens diarios como parte de la renta básica universal.",
		"smart_contract": "renta_basica_smart_contract",
		"accion": "Distribuir tokens a la cartera del ciudadano."
	  },
	  {
		"evento": "Compra de pan",
		"descripcion": "El ciudadano utiliza sus tokens para comprar pan diariamente.",
		"smart_contract": "compra_pan_smart_contract",
		"accion": "Descontar tokens de la cuenta del ciudadano y entregarle pan."
	  },
	  {
		"evento": "Participación en votaciones",
		"descripcion": "El ciudadano participa en votaciones sobre la gestión de recursos de las DAOs.",
		"smart_contract": "votacion_smart_contract",
		"accion": "Emitir votos utilizando los tokens de gobernanza."
	  },
	  {
		"evento": "Pago de recompensas",
		"descripcion": "El ciudadano recibe tokens por participar en tareas o proyectos comunitarios.",
		"smart_contract": "recompensa_smart_contract",
		"accion": "El ciudadano recibe tokens como recompensa por su participación."
	  }
	]
}

const panadero = {
	"modelo": "DAO-Panadería",
	"agente": {
	  "nombre": "panadero_1",
	  "ssb_id": "pana12345",
	  "cartera_ethereum": "0xdef678..."
	},
	"ciclo_de_vida": [
	  {
		"evento": "Propuesta de recursos",
		"descripcion": "El panadero propone la cantidad de harina y lenya necesarias para la producción de pan.",
		"smart_contract": "horneado_smart_contract",
		"accion": "Someter a votación la cantidad de recursos requeridos."
	  },
	  {
		"evento": "Horneado de pan",
		"descripcion": "El panadero hornea el pan utilizando los recursos asignados.",
		"smart_contract": "horneado_smart_contract",
		"accion": "Gestionar el proceso de horneado del pan."
	  },
	  {
		"evento": "Entrega de pan",
		"descripcion": "Entregar el pan a los ciudadanos de la comunidad.",
		"smart_contract": "entrega_smart_contract",
		"accion": "Gestionar la distribución del pan a los hogares."
	  },
	  {
		"evento": "Pago de recompensas",
		"descripcion": "Pago en tokens por el trabajo de horneado y entrega del pan.",
		"smart_contract": "recompensa_smart_contract",
		"accion": "El panadero recibe tokens por su trabajo."
	  }
	]
}

const molinero = {
	"modelo": "DAO-Molienda",
	"agente": {
	  "nombre": "molinero_1",
	  "ssb_id": "moli12345",
	  "cartera_ethereum": "0xghi901..."
	},
	"ciclo_de_vida": [
	  {
		"evento": "Propuesta de molienda",
		"descripcion": "El molinero propone el número de toneladas de trigo que debe ser molido.",
		"smart_contract": "molienda_smart_contract",
		"accion": "Someter a votación la cantidad de trigo que será procesado."
	  },
	  {
		"evento": "Proceso de molienda",
		"descripcion": "El molinero muele el trigo para producir harina.",
		"smart_contract": "molienda_smart_contract",
		"accion": "Realizar la molienda y preparar la harina para la distribución."
	  },
	  {
		"evento": "Distribución de harina",
		"descripcion": "Distribuir la harina a las panaderías.",
		"smart_contract": "distribucion_smart_contract",
		"accion": "Gestionar la logística de distribución hacia las panaderías."
	  },
	  {
		"evento": "Pago de recompensas",
		"descripcion": "Pago en tokens por el trabajo de molienda y distribución.",
		"smart_contract": "recompensa_smart_contract",
		"accion": "El molinero recibe tokens por su trabajo."
	  }
	]
  }

const agricultor = {
	"modelo": "DAO-Cultivo",
	"agente": {
	  "nombre": "agricultor_1",
	  "ssb_id": "agri12345",
	  "cartera_ethereum": "0xabc123..."
	},
	"ciclo_de_vida": [
	  {
		"evento": "Propuesta de cantidad de trigo",
		"descripcion": "El agricultor propone la cantidad de trigo que debe ser cultivada este ciclo.",
		"smart_contract": "cultivo_smart_contract",
		"accion": "Someter a votación la cantidad de trigo necesaria."
	  },
	  {
		"evento": "Asignación de recursos",
		"descripcion": "Asignación de tierras y recursos para el cultivo.",
		"smart_contract": "cultivo_smart_contract",
		"accion": "Asignar tierras, agua y personal."
	  },
	  {
		"evento": "Recolección de trigo",
		"descripcion": "Recolección del trigo al finalizar el ciclo de cultivo.",
		"smart_contract": "recoleccion_smart_contract",
		"accion": "El agricultor recolecta el trigo y lo prepara para la molienda."
	  },
	  {
		"evento": "Pago de recompensas",
		"descripcion": "Pago en tokens por el trabajo de cultivo y recolección.",
		"smart_contract": "recompensa_smart_contract",
		"accion": "El agricultor recibe tokens por su trabajo."
	  }
	]
}

interface DAO_Unit {
	nombre: string;
	descripcion: string;
	tareas: Tarea[];
	smart_contracts: SmartContract[];
}

// Interfaz genérica para los modelos (DAO y Ciudadano)
interface Modelo {
	nombre: string;
	ciclo_de_vida: CicloDeVida[];
  }



export const AN_SINDIC_YV_mundo = {
	comunidad,
	"agentes": [
		ciudadano, panadero, molinero, agricultor
	],
	interacciones
}


// Clase DAO actualizada para incluir fases
export class DAO {
	nombre: string;
	faseActual: string;

	constructor(nombre: string) {
	  this.nombre = nombre;
	  this.faseActual = "";
	}

	realizarTransaccion(fase: string) {
	  this.faseActual = fase;
	  console.log(`DAO ${this.nombre} está en la fase: ${this.faseActual}`);
	}
  }

  // Clase SimuladorDAO actualizada con enumeraciones
export class SimuladorDAO {
	estadoMundo: EstadoMundo;
	estadoJornada: EstadoJornada;
	diaActual: number;
	mesActual: number;
	almacen: DAO;
	DAOs: DAO[];

	constructor() {
	  this.estadoMundo = EstadoMundo.Invierno; // Estado inicial del mundo
	  this.estadoJornada = EstadoJornada.Inicio; // Estado inicial de la jornada
	  this.diaActual = 1;
	  this.mesActual = 1;
	  this.almacen = new DAO("DAO-Almacen");
	  this.DAOs = [
		new DAO("DAO-Cultivo"),
		new DAO("DAO-Molienda"),
		new DAO("DAO-Panadería"),
		this.almacen
	  ];
	}

	// Simula un ciclo completo de 365 días
	simularAnioCompleto() {
	  for (let i = 1; i <= 365; i++) {
		this.simularDia();
		this.avanzarDia();
	  }
	  console.log("Simulación de 365 días completada.");
	}

	// Simula un día de la jornada
	simularDia() {
	  switch (this.estadoJornada) {
		case EstadoJornada.Inicio:
		  this.iniciarJornada();
		  break;
		case EstadoJornada.Transacciones:
		  this.realizarTransacciones();
		  break;
		case EstadoJornada.Final:
		  this.finalizarJornada();
		  break;
		default:
		  console.log("Estado de jornada no reconocido.");
	  }
	}

	// Avanza el día y actualiza los meses y estaciones
	avanzarDia() {
	  this.diaActual++;
	  if (this.diaActual > 30) { // Suponiendo 30 días por mes para simplificación
		this.diaActual = 1;
		this.mesActual++;
		this.actualizarEstadoMundo();
	  }
	  if (this.mesActual > 12) {
		this.mesActual = 1;
	  }
	}

	// Actualiza el estado del mundo según el mes usando enumeraciones
	actualizarEstadoMundo() {
	  switch (this.mesActual) {
		case 1: case 2: case 3:
		  this.estadoMundo = EstadoMundo.Invierno; // Planificación y siembra
		  break;
		case 4: case 5: case 6:
		  this.estadoMundo = EstadoMundo.Primavera; // Crecimiento de trigo
		  break;
		case 7: case 8: case 9:
		  this.estadoMundo = EstadoMundo.Verano; // Recolección de trigo
		  break;
		case 10: case 11: case 12:
		  this.estadoMundo = EstadoMundo.Otonyo; // Producción de harina y pan
		  break;
		default:
		  console.log("Mes no reconocido.");
	  }
	  console.log(`Mes: ${this.mesActual}, Estado del Mundo: ${this.estadoMundo}`);
	}

	// Inicia la jornada diaria
	iniciarJornada() {
	  console.log(`Día ${this.diaActual}: Iniciando jornada.`);
	  this.estadoJornada = EstadoJornada.Transacciones;
	  // Distribuir la renta básica a los ciudadanos
	  this.DAOs.forEach(dao => dao.realizarTransaccion("Distribución de renta básica"));
	}

	// Realiza las transacciones diarias
	realizarTransacciones() {
	  console.log("Realizando transacciones diarias entre DAOs.");
	  // Simular interacción con la DAO-Almacén basado en la estación
	  switch (this.estadoMundo) {
		case EstadoMundo.Invierno:
		  // Fase de Siembra
		  this.DAOs.find(dao => dao.nombre === "DAO-Cultivo")?.realizarTransaccion(FaseCultivo.Siembra);
		  break;
		case EstadoMundo.Primavera:
		  // Fase de Crecimiento
		  this.DAOs.find(dao => dao.nombre === "DAO-Cultivo")?.realizarTransaccion(FaseCultivo.Crecimiento);
		  break;
		case EstadoMundo.Verano:
		  // Fase de Recolección y Ensacado
		  this.DAOs.find(dao => dao.nombre === "DAO-Cultivo")?.realizarTransaccion(FaseCultivo.Recoleccion);
		  this.DAOs.find(dao => dao.nombre === "DAO-Cultivo")?.realizarTransaccion(FaseCultivo.Ensacado);
		  // Entregar trigo al almacén
		  console.log(`DAO-Cultivo entrega trigo al DAO-Almacen.`);
		  break;
		case EstadoMundo.Otonyo:
		  // Fase de Molienda
		  this.DAOs.find(dao => dao.nombre === "DAO-Molienda")?.realizarTransaccion(FaseMolienda.Molienda);
		  // Entregar harina al almacén
		  console.log(`DAO-Molienda entrega harina al DAO-Almacen.`);
		  // Fase de Horneado y Distribución de Pan
		  this.DAOs.find(dao => dao.nombre === "DAO-Panadería")?.realizarTransaccion(FasePanaderia.Horneado);
		  this.DAOs.find(dao => dao.nombre === "DAO-Panadería")?.realizarTransaccion(FasePanaderia.DistribucionPan);
		  break;
		default:
		  console.log("Estado del mundo no reconocido para transacciones.");
	  }

	  // Interacción con DAO-Almacén
	  this.DAOs.forEach(dao => {
		if (dao.nombre !== "DAO-Almacen") {
		  console.log(`${dao.nombre} interactúa con ${this.almacen.nombre}.`);
		}
	  });

	  this.estadoJornada = EstadoJornada.Final;
	}

	// Finaliza la jornada diaria
	finalizarJornada() {
	  console.log(`Día ${this.diaActual}: Finalizando jornada.`);
	  this.estadoJornada = EstadoJornada.Inicio;
	}
  }
