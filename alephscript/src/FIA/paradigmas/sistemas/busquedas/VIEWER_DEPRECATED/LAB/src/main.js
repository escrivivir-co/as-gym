import { breadthFirstSearch, depthFirstSearch, iterativeDeepeningBreadthFirstSearch, iterativeDeepeningDepthFirstSearch } from './algorithms.js';

function setStatus(status) {
    document.getElementById('status').innerText = `Estado: ${status}`;
}

function setDetails(details) {
    document.getElementById('details').innerText = details;
}

async function loadMaze() {
    setStatus('Cargando laberinto');
    const response = await fetch("maze.json");
    const mazeArray = await response.json();
    const maze = mazeArray.map((row, y) =>
        row.map((cell, x) => ({
            x,
            y,
            wall: cell === 1,
            explored: false,
            solution: false
        }))
    );
    setStatus('Laberinto cargado');
    return maze;
}

async function loadTree() {
    setStatus('Cargando árbol');
    const response = await fetch("tree.json");
    const tree = await response.json();
    setStatus('Árbol cargado');
    return tree;
}

function drawMaze(d3, maze) {
    const svg = d3.select("#visualization");
    svg.selectAll("*").remove();  // Limpiar visualización previa
    const cellSize = 20;

    const rows = svg.selectAll(".row")
        .data(maze)
        .enter()
        .append("g")
        .attr("class", "row");

    rows.selectAll(".cell")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("class", d => d.wall ? "cell wall" : "cell path")
        .attr("x", d => d.x * cellSize)
        .attr("y", d => d.y * cellSize)
        .attr("width", cellSize)
        .attr("height", cellSize);
}

function drawTree(d3, tree) {
    const svg = d3.select("#visualization");
    svg.selectAll("*").remove();  // Limpiar visualización previa

    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    const width = +svg.attr("width") - margin.right - margin.left;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const treemap = d3.tree().size([height, width]);
    const root = d3.hierarchy(tree, d => d.children);

    const nodes = treemap(root).descendants();
    const links = treemap(root).descendants().slice(1);

    // Links
    const link = g.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d => `
            M${d.y},${d.x}
            C${d.y + 100},${d.x}
             ${d.parent.y + 100},${d.parent.x}
             ${d.parent.y},${d.parent.x}
        `);

    // Nodes
    const node = g.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
        .attr("r", 10)
        .style("fill", d => d.data.explored ? "yellow" : d.data.solution ? "red" : "white");

    node.append("text")
        .attr("dy", ".35em")
        .attr("x", d => d.children ? -13 : 13)
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.id);
}

function visualizeAlgorithm(d3, data, algorithm, mode) {
    setStatus('Ejecutando algoritmo');
    setDetails('');
    const startTime = performance.now();

    algorithm(data).then(path => {
        const endTime = performance.now();
        const executionTime = (endTime - startTime).toFixed(2);
        const svg = d3.select("#visualization");

        if (mode === 'maze') {
            const cellSize = 20;
            const cells = svg.selectAll(".cell")
                .data(data.flat())
                .attr("class", d => {
                    if (d.wall) return "cell wall";
                    if (d.solution) return "cell solution";
                    if (d.explored) return "cell explored";
                    return "cell path";
                });

            path.forEach(cell => {
                cell.solution = true;
            });

            cells.attr("class", d => {
                if (d.wall) return "cell wall";
                if (d.solution) return "cell solution";
                if (d.explored) return "cell explored";
                return "cell path";
            });
        } else if (mode === 'tree') {
            const nodes = d3.selectAll(".node circle");
            nodes.style("fill", d => {
                if (path.includes(d.data.id)) return "red";
                if (d.data.explored) return "yellow";
                return "white";
            });
        }

        setStatus(`Búsqueda finalizada: Solución encontrada con ${path.length} pasos`);
        setDetails(`Tiempo de ejecución: ${executionTime} ms\nPasos totales: ${path.length}`);
    });
}

async function regenerateMaze() {
    setStatus('Regenerando laberinto');
    await fetch("/generate-maze");  // Asume que el endpoint generate-maze regenera el laberinto
    const maze = await loadMaze();
    drawMaze(d3, maze);
    const algorithm = document.getElementById("algorithm").value;
    visualizeAlgorithm(d3, maze, getAlgorithmFunction(algorithm), 'maze');
}

async function regenerateTree() {
    setStatus('Regenerando árbol');
    await fetch("/generate-tree");  // Asume que el endpoint generate-tree regenera el árbol
    const tree = await loadTree();
    drawTree(d3, tree);
    const algorithm = document.getElementById("algorithm").value;
    visualizeAlgorithm(d3, tree, getAlgorithmFunction(algorithm), 'tree');
}

function getAlgorithmFunction(name) {
    switch (name) {
        case 'breadthFirstSearch': return breadthFirstSearch;
        case 'depthFirstSearch': return depthFirstSearch;
        case 'iterativeDeepeningBreadthFirstSearch': return iterativeDeepeningBreadthFirstSearch;
        case 'iterativeDeepeningDepthFirstSearch': return iterativeDeepeningDepthFirstSearch;
        default: return breadthFirstSearch;
    }
}

async function main() {
    const mode = document.getElementById("mode").value;
    if (mode === 'maze') {
        const maze = await loadMaze();
        drawMaze(d3, maze);
        document.getElementById("regenerateMaze").addEventListener("click", regenerateMaze);
        visualizeAlgorithm(d3, maze, breadthFirstSearch, 'maze');
    } else if (mode === 'tree') {
        const tree = await loadTree();
        drawTree(d3, tree);
        document.getElementById("regenerateTree").addEventListener("click", regenerateTree);
        visualizeAlgorithm(d3, tree, breadthFirstSearch, 'tree');
    }
    document.getElementById("algorithm").addEventListener("change", async () => {
        const algorithm = document.getElementById("algorithm").value;
        setStatus(`Activando algoritmo: ${algorithm}`);
        setDetails('');
        if (mode === 'maze') {
            const maze = await loadMaze();
            visualizeAlgorithm(d3, maze, getAlgorithmFunction(algorithm), 'maze');
        } else if (mode === 'tree') {
            const tree = await loadTree();
            visualizeAlgorithm(d3, tree, getAlgorithmFunction(algorithm), 'tree');
        }
    });
    document.getElementById("mode").addEventListener("change", main);
}

main();
