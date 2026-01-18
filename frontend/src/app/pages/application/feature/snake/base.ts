
export class BaseSnakeGameComponent {
  canvas: any; /* HTMLCanvasElement*/
  ctx: any; /* CanvasRenderingContext2D */;

  snake: { x: number, y: number }[] = [{ x: 10, y: 10 }];
  food = { x: 5, y: 5 };
  direction = { x: 0, y: -1 }; // Por defecto, la serpiente se mueve hacia arriba
  gridSize = 10; // Tamaño del grid (cada celda)
  score = 0;
  gameOver = false;

  constructor() {}

  oInit(document: Document): void {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');

    // Generar comida en una posición aleatoria al inicio
    this.generateFood();

  }

  // Lógica para mover la serpiente basada en la acción elegida
  takeAction(action: string): void {
    switch (action) {
      case 'up':
        this.direction = { x: 0, y: -1 };
        break;
      case 'down':
        this.direction = { x: 0, y: 1 };
        break;
      case 'left':
        this.direction = { x: -1, y: 0 };
        break;
      case 'right':
        this.direction = { x: 1, y: 0 };
        break;
    }

    this.updateSnake();
  }

  // Actualiza la posición de la serpiente y verifica colisiones
  updateSnake(): void {
    const head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };

    // Verificar si la serpiente choca con los bordes o consigo misma
    if (this.isCollision(head)) {
      this.gameOver = true;
      return;
    }

    // Añadir la nueva cabeza a la serpiente
    this.snake.unshift(head);

    // Si la serpiente come la comida
    if (this.snake[0].x === this.food.x && this.snake[0].y === this.food.y) {
      this.score += 10;
      this.generateFood();
    } else {
      // Si no come, quitar la cola (movimiento normal)
      this.snake.pop();
    }
  }

  // Verifica si la serpiente choca consigo misma o con los bordes
  isCollision(position: { x: number, y: number }): boolean {
    // Choca con los bordes
    if (position.x < 0 || position.x >= this.canvas.width / this.gridSize ||
        position.y < 0 || position.y >= this.canvas.height / this.gridSize) {
      return true;
    }

    // Choca consigo misma
    for (let i = 1; i < this.snake.length; i++) {
      if (this.snake[i].x === position.x && this.snake[i].y === position.y) {
        return true;
      }
    }

    return false;
  }

  // Genera comida en una posición aleatoria
  generateFood(): void {
    this.food = {
      x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
      y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
    };
  }

  // Calcular la recompensa del juego
  calculateReward(): number {
    // Recompensa por comer comida
    if (this.snake[0].x === this.food.x && this.snake[0].y === this.food.y) {
      return 10;
    }

    // Penalización por morir
    if (this.gameOver) {
      return -10;
    }

    // Penalización por cada paso (para incentivar a comer rápidamente)
    return -1;
  }

  // Dibujar la serpiente y la comida
  draw(): void {
    // Limpiar el lienzo
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujar la comida
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize, this.gridSize);

    // Dibujar la serpiente
    this.ctx.fillStyle = 'green';
    this.snake.forEach(part => {
      this.ctx.fillRect(part.x * this.gridSize, part.y * this.gridSize, this.gridSize, this.gridSize);
    });
  }
}
