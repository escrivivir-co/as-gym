import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { ChatRoomComponent } from '../chat/component';
import { LoggerComponent } from '../logger/logger';
import { TreeNodeComponent } from '../tree-node/tree-node';
import { DEFAULT_ROOT_NODE, 
	DEFAULT_SUDOKU_DATA, SudokuData } from '/Users/morente/Desktop/THEIA_PATH/AlephWeb/angular-app/alephscript/src/FIA/engine/kernel/sudoku';

@Component({
  standalone: true,
  selector: 'app-sudoku',
  templateUrl: './sudoku.html',
  styleUrls: ['./sudoku.css'],
  imports: [CommonModule, DynamicFormComponent, ChatRoomComponent,
	LoggerComponent,
	TreeNodeComponent]
})
export class SudokuComponent {

@Input()
	set data(value: SudokuData) {
		this._data = value;
		const d = value;
		this.updateTreeNodes(
			d.currentCell.row, d.currentCell.col, d.k, d.level, this.data.backtrackCell
		)
	}
	get data(): SudokuData {
		return this._data;
	}

	_data: SudokuData = DEFAULT_SUDOKU_DATA;

	rootNode: any = DEFAULT_ROOT_NODE;

	currentNode: any =  this.rootNode;

	isCurrentCell(row: number, col: number): boolean {
		const isback = this.data.currentCell?.row === row && this.data.currentCell?.col === col
		// if (isback) console.log("is current", row, col)
		return isback;
	}

	isBacktrackCell(row: number, col: number): boolean {
		const isback = this.data.backtrackCell?.row === row && this.data.backtrackCell?.col === col;
		// if (isback) console.log("is back", row, col)
		return isback
	}

	updateTreeNodes(row: number, col: number, k: number, level: number, backtrack: { row: number, col: number } | null): void {
		const info = `Row: ${row}, Col: ${col}, K: ${k}, Level: ${level}`;
		const newNode = { info, children: [], isCurrent: true, isBacktrack: false };
		this.currentNode.children.push(newNode);
		this.currentNode.isCurrent = false;

		if (backtrack) {
		  this.currentNode.isBacktrack = true;
		  this.currentNode = this.findParentNode(this.rootNode, row, col);
		} else {
		  this.currentNode = newNode;
		}
	  }

	findParentNode(node: any, row: number, col: number): any {
	if (!node.children) return null;
	for (const child of node.children) {
		if (child.info.includes(`Row: ${row}, Col: ${col}`)) {
		return node;
		}
		const foundNode = this.findParentNode(child, row, col);
		if (foundNode) return foundNode;
	}
	return null;
	}
}