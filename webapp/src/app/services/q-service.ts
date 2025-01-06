import { Injectable } from "@angular/core";

/*
1. Q-learning con tabla Q (nuestro desarrollo actual)
Necesidad temporal y espacial de memoria:
Espacio de memoria (Requerimientos espaciales):

El Q-learning clásico utiliza una tabla para almacenar los valores Q para cada combinación de estado y acción. En nuestro caso, esto implica almacenar una entrada en la tabla por cada par (estado, acción), donde:

El estado incluye la posición de la serpiente, la posición de la comida y la dirección actual.
Las acciones posibles son: up, down, left, right.
El tamaño de la tabla depende de la cantidad de estados posibles, que es proporcional al tamaño del tablero y la complejidad de la representación del estado.

Si el tablero tiene 
𝑁
×
𝑁
N×N celdas y la serpiente tiene una longitud 
𝐿
L, el número de posibles combinaciones de posiciones de la serpiente y la comida puede crecer rápidamente, resultando en una tabla Q de tamaño 
𝑂
(
𝑁
2
⋅
𝐿
)
O(N 
2
 ⋅L).
La memoria necesaria para almacenar la tabla Q crece de manera exponencial con respecto al tamaño del tablero y la longitud de la serpiente, dado que cada estado individual debe tener su propio espacio de memoria en la tabla.

Limitación: Este enfoque es poco escalable, ya que almacenar todos los posibles estados se vuelve inviable en tableros grandes o con una serpiente muy larga, debido a la explosión combinatoria.

Tiempo de memoria (Requerimientos temporales):

El algoritmo actualiza el valor de la tabla Q para el estado y acción actuales en cada paso del juego. Esto implica:
Elegir una acción (búsqueda de la mejor acción en el estado actual) con un costo de tiempo de 
𝑂
(
1
)
O(1) en nuestro caso.
Actualizar la tabla Q en cada iteración con una fórmula que también es 
𝑂
(
1
)
O(1).
Velocidad: Las actualizaciones son rápidas, pero el rendimiento general disminuye conforme el tamaño del tablero y la serpiente crecen, ya que la tabla Q se vuelve más grande.
*/
@Injectable({ providedIn: 'root' })
export class ReinforcementLearningService {
  qTable: { [state: string]: { [action: string]: number } } = {};
  alpha = 0.1; // Tasa de aprendizaje
  gamma = 0.9; // Factor de descuento
  epsilon = 0.1; // Política epsilon-greedy
  
  constructor() {}

  // Convierte el estado (posición de la serpiente, comida, y dirección) en una cadena legible
  public getState(snake: {x: number, y: number}[], food: {x: number, y: number}, direction: {x: number, y: number}): string {
    const snakeHead = snake[0];
    return `${snakeHead.x},${snakeHead.y}|${food.x},${food.y}|${direction.x},${direction.y}`;
  }

  // Selecciona una acción usando epsilon-greedy
  chooseAction(state: string): string {
    if (!this.qTable[state]) {
      // Si el estado no está en la tabla, inicializamos con 0 para todas las acciones
      this.qTable[state] = { up: 0, down: 0, left: 0, right: 0 };
    }

    // Explora con probabilidad epsilon (elige una acción aleatoria)
    if (Math.random() < this.epsilon) {
      const actions = ['up', 'down', 'left', 'right'];
      return actions[Math.floor(Math.random() * actions.length)];
    }

    // Explota el conocimiento existente (elige la mejor acción según la tabla Q)
    return this.getBestAction(state);
  }

  // Obtiene la mejor acción (la que tiene mayor valor Q)
  private getBestAction(state: string): string {
    const actions = this.qTable[state];
    return Object.keys(actions).reduce((bestAction, currentAction) => 
      actions[currentAction] > actions[bestAction] ? currentAction : bestAction
    );
  }

  // Actualiza la tabla Q después de realizar una acción y recibir una recompensa
  updateQTable(state: string, action: string, reward: number, newState: string): void {
    if (!this.qTable[state]) {
      // Inicializamos si el estado no está en la tabla
      this.qTable[state] = { up: 0, down: 0, left: 0, right: 0 };
    }

    if (!this.qTable[newState]) {
      // Aseguramos que el nuevo estado también esté inicializado
      this.qTable[newState] = { up: 0, down: 0, left: 0, right: 0 };
    }

    // Fórmula de actualización de Q-learning
    const oldQValue = this.qTable[state][action];
    const bestFutureQValue = Math.max(...Object.values(this.qTable[newState]));

    this.qTable[state][action] = oldQValue + this.alpha * (reward + this.gamma * bestFutureQValue - oldQValue);
  }
}
