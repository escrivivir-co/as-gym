import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ReinforcementLearningService } from '../../../../services/q-service';
import { CommonModule } from '@angular/common';
import { BaseSnakeGameComponent } from './base';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-snake-game',
  standalone: true,
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css'],
  imports: [CommonModule]
})
export class SnakeGameComponent extends BaseSnakeGameComponent implements OnInit {

  constructor(
	@Inject(PLATFORM_ID) private platformId: object,
	private rlService: ReinforcementLearningService) {
	super();
  }

  ngOnInit(): void {

	if (isPlatformBrowser(this.platformId)) {
		this.oInit(document);
		this.gameLoop();
	}
	
  }

  gameLoop(): void {

    if (this.gameOver) {

      	console.log('Game Over');

		this.gameOver = false;
		this.direction.x = this.direction.x * -1;
		this.direction.y = this.direction.y * -1;

    }

    // Obtener el estado actual
    const currentState = this.rlService.getState(this.snake, this.food, this.direction);

	console.log(currentState)

    // Elegir la acción a tomar
    const action = this.rlService.chooseAction(currentState);

    // Ejecutar la acción (mover la serpiente)
    this.takeAction(action);

    // Calcular la recompensa (por ejemplo, -1 por moverse, +10 por comida, -10 por morir)
    const reward = this.calculateReward();

    // Obtener el nuevo estado
    const newState = this.rlService.getState(this.snake, this.food, this.direction);

	console.log(reward, newState)

    // Actualizar la tabla Q con la recompensa y el nuevo estado
    this.rlService.updateQTable(currentState, action, reward, newState);

	console.log(this.rlService.qTable)

    // Dibujar el estado actual
    this.draw();

    // Continuar el ciclo del juego
    setTimeout(() => this.gameLoop(), 100);
  }


}

