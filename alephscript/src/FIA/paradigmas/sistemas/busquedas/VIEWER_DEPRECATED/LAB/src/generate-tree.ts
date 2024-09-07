import * as fs from 'fs';
import * as _ from 'lodash';

interface TreeNode {
    id: string;
    children: TreeNode[];
}

function generateTree(depth: number, breadth: number): TreeNode {
    function createNode(id: string, currentDepth: number): TreeNode {
        if (currentDepth >= depth) {
            return { id, children: [] };
        }

        const children = _.times(breadth, (i) => createNode(`${id}.${i}`, currentDepth + 1));
        return { id, children };
    }

    return createNode('root', 0);
}

function saveTreeToJson(tree: TreeNode, filename: string): void {
    fs.writeFileSync(filename, JSON.stringify(tree, null, 2));
}

const depth = 4;
const breadth = 3;
const tree = generateTree(depth, breadth);
saveTreeToJson(tree, './src/tree.json');

console.log('Tree generated and saved to tree.json');
