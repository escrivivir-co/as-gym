import { ArcoEstructural } from "../arco";
import { IGrafo, Entidad, Grafo } from "../grafo";
import { IPregunta, ApunteEquiparacion, TecnicasInferenciaRed } from "../regla";

/**
 * Toda proposición contenida en una sentencia tiene
 *  una estructura profunda formada por un verbo
 * (elemento principal) y una o más frases nominales,
 * que se relacionan con el verbo por casos (agente, contra-agente,
 * objeto, resultado, instrumento, origen, propósito, lugar, tiempo, sujeto).
 *  La modalidad hace referencia al tiempo (presente, pasado, futuro)
 *  y la voz (activa o pasiva) del verbo.
 * Para presentar “Luis sabe que Pepe vio el Prado en Madrid”
 * se puede hacer así: luis_sabe_que.png
 */
class Cargador {
    grafo: IGrafo;

    constructor() {
        this.grafo = this.inicializarRed();
    }

    inicializarRed(): IGrafo {

        const sucesoSaber = new Grafo();
        sucesoSaber.nombre = "Suceso_Saber";

        const sucesoVer = new Grafo();
        sucesoVer.nombre = "Suceso_Ver";

        const saber1 = new Grafo();
        saber1.nombre = "Saber_1";

        const ver1 = new Grafo();
        ver1.nombre = "Ver_1";

        const luis = new Grafo();
        luis.nombre = "Luis";

        const pepe = new Grafo();
        pepe.nombre = "Pepe";

        const museo = new Grafo();
        museo.nombre = "Museo";

        const elPrado = new Grafo();
        elPrado.nombre = "El Prado";

        const madrid = new Grafo();
        madrid.nombre = "Madrid";

        const activa = new Grafo();
        activa.nombre = "Activa";

        const presente = new Grafo();
        presente.nombre = "Presente";

        const pasado = new Grafo();
        pasado.nombre = "Pasado";

        // Crear relaciones (arcos) y conectar entidades
        const saberSubclase = new ArcoEstructural();
        saberSubclase.etiqueta.estado.nombre = "subclase_de";
        saberSubclase.destino = sucesoSaber;

        const verSubclase = new ArcoEstructural();
        verSubclase.etiqueta.estado.nombre = "subclase_de";
        verSubclase.destino = sucesoVer;

        const saberInstancia = new ArcoEstructural();
        saberInstancia.etiqueta.estado.nombre = "instancia";
        saberInstancia.destino = saber1;

        const verInstancia = new ArcoEstructural();
        verInstancia.etiqueta.estado.nombre = "instancia";
        verInstancia.destino = ver1;
        // Conectar 'Saber_1' a 'Luis' y 'Ver_1'
        const saber1Agente = new ArcoEstructural();
        saber1Agente.etiqueta.estado.nombre = "agente";
        saber1Agente.destino = luis;

        const saber1Objeto = new ArcoEstructural();
        saber1Objeto.etiqueta.estado.nombre = "objeto";
        saber1Objeto.destino = ver1;

        saber1.arcos.estado.push(saber1Agente, saber1Objeto);

        // Conectar 'Ver_1' a 'Pepe', 'El Prado', 'Madrid'
        const ver1Agente = new ArcoEstructural();
        ver1Agente.etiqueta.estado.nombre = "agente";
        ver1Agente.destino = pepe;

        const ver1Objeto = new ArcoEstructural();
        ver1Objeto.etiqueta.estado.nombre = "objeto";
        ver1Objeto.destino = museo;

        const museoInstancia = new ArcoEstructural();
        museoInstancia.etiqueta.estado.nombre = "instancia";
        museoInstancia.destino = elPrado;

        const ver1Lugar = new ArcoEstructural();
        ver1Lugar.etiqueta.estado.nombre = "lugar";
        ver1Lugar.destino = madrid;

        ver1.arcos.estado.push(ver1Agente, ver1Objeto, ver1Lugar);
        museo.arcos.estado.push(museoInstancia);

        // Conectar los tiempos y la voz a 'Saber_1' y 'Ver_1'
        const saber1Voz = new ArcoEstructural();
        saber1Voz.etiqueta.estado.nombre = "voz";
        saber1Voz.destino = activa;

        const saber1Tiempo = new ArcoEstructural();
        saber1Tiempo.etiqueta.estado.nombre = "tiempo";
        saber1Tiempo.destino = presente;

        const ver1Voz = new ArcoEstructural();
        ver1Voz.etiqueta.estado.nombre = "voz";
        ver1Voz.destino = activa; // La misma entidad 'Activa' para la voz

        const ver1Tiempo = new ArcoEstructural();
        ver1Tiempo.etiqueta.estado.nombre = "tiempo";
        ver1Tiempo.destino = pasado;

        saber1.arcos.estado.push(saber1Voz, saber1Tiempo);
        ver1.arcos.estado.push(ver1Voz, ver1Tiempo);

        // Asegurar que 'Suceso_Saber' y 'Suceso_Ver' sean subclases de 'Suceso'
        const sucesoSaberSubclase = new ArcoEstructural();
        sucesoSaberSubclase.etiqueta.estado.nombre = "subclase_de";
        sucesoSaberSubclase.destino = sucesoSaber;

        const sucesoVerSubclase = new ArcoEstructural();
        sucesoVerSubclase.etiqueta.estado.nombre = "subclase_de";
        sucesoVerSubclase.destino = sucesoVer;

        // La entidad raíz 'Suceso' podría ser una nueva entidad que no se muestra en la imagen
        const suceso = new Grafo();
        suceso.nombre = "Suceso";
        suceso.arcos.estado.push(sucesoSaberSubclase, sucesoVerSubclase);

        // Conectar instancias de saber y ver a sus respectivas clases
        const saber1Instancia = new ArcoEstructural();
        saber1Instancia.etiqueta.estado.nombre = "instancia";
        saber1Instancia.destino = saber1;

        const ver1Instancia = new ArcoEstructural();
        ver1Instancia.etiqueta.estado.nombre = "instancia";
        ver1Instancia.destino = ver1;

        sucesoSaber.arcos.estado.push(saber1Instancia);
        sucesoVer.arcos.estado.push(ver1Instancia);

        // El grafo completo es accesible desde 'Suceso', que actúa como la raíz de la red semántica.
        return suceso;
    }

    test() {
        // Primero, definimos una pregunta
        const pregunta: IPregunta = {
            esperado: true,
            texto: "¿Qué suceso sabe Luis?",
            constantes: [], // Aquí podríamos incluir a Luis si fuera necesario.
            variables: [], // La variable que queremos resolver es el suceso que Luis sabe.
            arcos: [] // No tenemos arcos predefinidos para esta pregunta.
        };
        
        // Creamos una instancia de ApunteEquiparacion
        const apunteEquiparacion = new ApunteEquiparacion();
        apunteEquiparacion.tipo = TecnicasInferenciaRed.equiparacion; // Tipo de técnica de inferencia
        apunteEquiparacion.red = this.grafo; // La red semántica inicializada en la clase Cargador
        apunteEquiparacion.pregunta = pregunta;
        
        // Implementamos una versión de la función 'inferir' que utiliza la lógica de búsqueda
        // que definimos anteriormente en el esquema de la clase ApunteEquiparacion.
        async function evaluarApunteEquiparacion(apunte: ApunteEquiparacion) {
            return apunte.inferir(apunte);
        }

        // Llamamos a evaluarApunteEquiparacion y esperamos el resultado.
        evaluarApunteEquiparacion(apunteEquiparacion).then(resultado => {
            console.log("El resultado de la equiparación es:", resultado);
        });

    }
}