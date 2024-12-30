const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('src'));

app.get('/generate-maze', (req, res) => {
    exec('npx ts-node src/generate-maze.ts', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            res.status(500).send('Error generating maze');
            return;
        }
        res.send('Maze generated');
    });
});

app.get('/generate-tree', (req, res) => {
    exec('npx ts-node src/generate-tree.ts', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            res.status(500).send('Error generating tree');
            return;
        }
        res.send('Tree generated');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
