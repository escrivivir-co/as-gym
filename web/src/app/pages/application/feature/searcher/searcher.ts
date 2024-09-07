import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { ChatRoomComponent } from '../chat/component';
import { LoggerComponent } from '../logger/logger';
import * as d3 from 'd3';
// 
import * as THREE from 'three';
import { IMenuState } from '../../../../../../../alephscript/src/FIA/engine/kernel/IMenuState';
import { GenericMap } from '../../../../../../../ws-server/src/alephscript/GenericMap';

@Component({
  standalone: true,
  selector: 'app-searcher',
  templateUrl: './searcher.html',
  styleUrls: ['./searcher.css'],
  imports: [CommonModule, DynamicFormComponent, ChatRoomComponent, LoggerComponent]
})
export class SearcherComponent {

	private m_currentApp: any// IMenuState;

@Input()
	get currentApp(): IMenuState {
		return this.m_currentApp;
	}
	set currentApp(value: IMenuState) {
		console.log("Set", value?.mundo?.modelo?.dominio?.base)
		this.m_currentApp = value;
	}

@Output() popUpEmiter = new EventEmitter<GenericMap>();

  infoContent: string = "";

  private svg: any;

  constructor(private el: ElementRef) {
    console.log("Start searcher", this.showInfo('BFS'));
    this.init2DView();
  }

  selectAlgorithm(al: string) {
    console.log("Start the info for selectAlgorithm");
	if (this.m_currentApp?.mundo?.modelo?.dominio?.base) {
		let c = this.m_currentApp.mundo.modelo.dominio.base.RPC;
		this.m_currentApp.mundo.modelo.dominio.base.RPC = {...c, al}
		this.popUpEmiter.emit(this.m_currentApp)
	}
	this.executeSearch('https://es.wikipedia.org/wiki/Wikipedia:Portada','casa');

  }

  showInfo(algorithm: string) {
    console.log("Start the info for", algorithm);
    switch (algorithm) {
      case 'BFS':
        this.infoContent = "<strong>BFS (Primero en Anchura)</strong><br>Completo: Sí<br>Admisible: Sí (si mismo coste)<br>Descripción: Explora todos los nodos en el mismo nivel antes de pasar al siguiente.";
        break;
      case 'DFS':
        this.infoContent = "<strong>DFS (Primero en Profundidad)</strong><br>Completo: No<br>Admisible: No<br>Descripción: Explora lo más profundo posible a lo largo de cada rama antes de retroceder.";
        break;
      case 'UniformCost':
        this.infoContent = "<strong>Coste Uniforme</strong><br>Completo: Sí<br>Admisible: Sí<br>Descripción: Explora el nodo con el menor coste acumulado desde el inicio.";
        break;
      case 'IterativeDeepening':
        this.infoContent = "<strong>Búsqueda Iterativa</strong><br>Completo: Sí<br>Admisible: Sí<br>Descripción: Combina la profundidad limitada con la completitud de BFS.";
        break;
      case 'AStar':
        this.infoContent = "<strong>A*</strong><br>Completo: Sí<br>Admisible: Sí (si h(n) es admisible)<br>Descripción: Usa coste real y estimado para encontrar el camino óptimo.";
        break;
      case 'BranchAndBound':
        this.infoContent = "<strong>Ramificación y Poda</strong><br>Completo: Sí<br>Admisible: Sí (con tiempo suficiente)<br>Descripción: Explora todas las soluciones posibles, evitando aquellas subóptimas.";
        break;
      case 'GreedySearch':
        this.infoContent = "<strong>Búsqueda Voraz</strong><br>Completo: No<br>Admisible: No<br>Descripción: Usa la heurística para decidir el próximo nodo, no garantiza óptimo.";
        break;
      case 'SimulatedAnnealing':
        this.infoContent = "<strong>Temple Simulado</strong><br>Completo: No<br>Admisible: No<br>Descripción: Inspirado en el enfriamiento del metal, explora soluciones cercanas.";
        break;
      default:
        this.infoContent = "Pasa el cursor sobre los botones para ver la información del algoritmo.";
    }
  }

  executeSearch(url: string, key: string) {
	console.log("Start the info for executeSearch");
	if (this.m_currentApp?.mundo?.modelo?.dominio?.base) {
		let c = this.m_currentApp.mundo.modelo.dominio.base.RPC;
		this.m_currentApp.mundo.modelo.dominio.base.RPC = {...c, target: url, key, state: "NO_INIT" }
		this.popUpEmiter.emit(this.m_currentApp)
	}

  }

  resetGraph() {
    // Implementa la lógica para reiniciar el gráfico aquí
  }

  private init2DView(): void {

	if (!this.el.nativeElement.querySelector('#visualizer-2d')) return;

    const width = this.el.nativeElement.querySelector('#visualizer-2d').clientWidth;
    const height = this.el.nativeElement.querySelector('#visualizer-2d').clientHeight;

    this.svg = d3.select('#visualizer-2d').append('svg')
      .attr('width', width)
      .attr('height', height);

	  const nodes = [
		{ id: 'user', name: 'User', group: 1, x: undefined, y: undefined, vx: undefined, vy: undefined },
		{ id: 'friend1', name: 'Friend 1', group: 2, x: undefined, y: undefined, vx: undefined, vy: undefined },
		{ id: 'friend2', name: 'Friend 2', group: 2, x: undefined, y: undefined, vx: undefined, vy: undefined }
	  ];

    const links = [
      { source: 'user', target: 'friend1' },
      { source: 'user', target: 'friend2' }
    ];

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = this.svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 1.5);

    const node = this.svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 10)
      .attr('fill', (d: any) => d.group === 1 ? 'red' : 'blue')
      .call(this.drag(simulation));

    node.append('title')
      .text((d: any) => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });
  }

  private drag(simulation: any) {
    return d3.drag()
      .on('start', (event: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on('drag', (event: any) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on('end', (event: any) => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      });
  }

}
