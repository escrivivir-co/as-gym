import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.html',
  styleUrls: ['./tree-node.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TreeNodeComponent {
  @Input() node: any;
}
