function getNeighbors(node, maze) {
    const neighbors = [];
    const directions = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 }
    ];

    for (const dir of directions) {
        const nx = node.x + dir.x;
        const ny = node.y + dir.y;
        if (nx >= 0 && ny >= 0 && nx < maze.length && ny < maze[0].length && !maze[ny][nx].wall) {
            neighbors.push({ x: nx, y: ny, parent: node, cost: node.cost + 1, depth: node.depth + 1 });
        }
    }

    return neighbors;
}

export async function breadthFirstSearch(maze) {
    const start = { x: 0, y: 0, parent: null, cost: 0, depth: 0 };
    const goal = { x: maze.length - 1, y: maze.length > 0 ? maze.length[0]?.length - 1 : 1, parent: null, cost: 0, depth: 0 };

    const queue = [start];
    const explored = new Set();
    let steps = 0;

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;

        const key = `${current.x},${current.y}`;
        if (explored.has(key)) continue;
        explored.add(key);

        maze[current.y][current.x].explored = true;
        steps++;
        await new Promise(requestAnimationFrame);

        if (current.x === goal.x && current.y === goal.y) {
            const path = [];
            let node = current;
            while (node) {
                path.push(maze[node.y][node.x]);
                node = node.parent;
            }
            console.log(`Búsqueda en Anchura finalizada en ${steps} pasos`);
            return path.reverse();
        }

        const neighbors = getNeighbors(current, maze);
        for (const neighbor of neighbors) {
            if (!explored.has(`${neighbor.x},${neighbor.y}`)) {
                queue.push(neighbor);
            }
        }
    }

    return [];
}

export async function depthFirstSearch(maze) {
    const start = { x: 0, y: 0, parent: null, cost: 0, depth: 0 };
    const goal = { x: maze.length - 1, y: maze[0].length - 1, parent: null, cost: 0, depth: 0 };

    const stack = [start];
    const explored = new Set();
    let steps = 0;

    while (stack.length > 0) {
        const current = stack.pop();
        if (!current) continue;

        const key = `${current.x},${current.y}`;
        if (explored.has(key)) continue;
        explored.add(key);

        maze[current.y][current.x].explored = true;
        steps++;
        await new Promise(requestAnimationFrame);

        if (current.x === goal.x && current.y === goal.y) {
            const path = [];
            let node = current;
            while (node) {
                path.push(maze[node.y][node.x]);
                node = node.parent;
            }
            console.log(`Búsqueda en Profundidad finalizada en ${steps} pasos`);
            return path.reverse();
        }

        const neighbors = getNeighbors(current, maze);
        for (const neighbor of neighbors) {
            if (!explored.has(`${neighbor.x},${neighbor.y}`)) {
                stack.push(neighbor);
            }
        }
    }

    return [];
}

export async function iterativeDeepeningBreadthFirstSearch(maze) {
    const start = { x: 0, y: 0, parent: null, cost: 0, depth: 0 };
    const goal = { x: maze.length - 1, y: maze[0].length - 1, parent: null, cost: 0, depth: 0 };
    let steps = 0;

    for (let limit = 1; limit <= maze.length * maze[0].length; limit++) {
        const queue = [start];
        const explored = new Set();

        while (queue.length > 0) {
            const current = queue.shift();
            if (!current) continue;

            const key = `${current.x},${current.y}`;
            if (explored.has(key)) continue;
            explored.add(key);

            maze[current.y][current.x].explored = true;
            steps++;
            await new Promise(requestAnimationFrame);

            if (current.x === goal.x && current.y === goal.y) {
                const path = [];
                let node = current;
                while (node) {
                    path.push(maze[node.y][node.x]);
                    node = node.parent;
                }
                console.log(`Búsqueda en Anchura Iterativa finalizada en ${steps} pasos`);
                return path.reverse();
            }

            if (current.depth < limit) {
                const neighbors = getNeighbors(current, maze);
                for (const neighbor of neighbors) {
                    if (!explored.has(`${neighbor.x},${neighbor.y}`)) {
                        queue.push(neighbor);
                    }
                }
            }
        }
    }

    return [];
}

export async function iterativeDeepeningDepthFirstSearch(maze) {
    const start = { x: 0, y: 0, parent: null, cost: 0, depth: 0 };
    const goal = { x: maze.length - 1, y: maze[0].length - 1, parent: null, cost: 0, depth: 0 };
    let steps = 0;

    for (let limit = 1; limit <= maze.length * maze[0].length; limit++) {
        const stack = [start];
        const explored = new Set();

        while (stack.length > 0) {
            const current = stack.pop();
            if (!current) continue;

            const key = `${current.x},${current.y}`;
            if (explored.has(key)) continue;
            explored.add(key);

            maze[current.y][current.x].explored = true;
            steps++;
            await new Promise(requestAnimationFrame);

            if (current.x === goal.x && current.y === goal.y) {
                const path = [];
                let node = current;
                while (node) {
                    path.push(maze[node.y][node.x]);
                    node = node.parent;
                }
                console.log(`Búsqueda en Profundidad Iterativa finalizada en ${steps} pasos`);
                return path.reverse();
            }

            if (current.depth < limit) {
                const neighbors = getNeighbors(current, maze);
                for (const neighbor of neighbors) {
                    if (!explored.has(`${neighbor.x},${neighbor.y}`)) {
                        stack.push(neighbor);
                    }
                }
            }
        }
    }

    return [];
}
