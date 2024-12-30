import { SimuladorDAO } from "./dao";

// Función principal para ejecutar la simulación
export function ejecutarSimulacion() {
	const simulador = new SimuladorDAO();
	simulador.simularAnioCompleto();
}


