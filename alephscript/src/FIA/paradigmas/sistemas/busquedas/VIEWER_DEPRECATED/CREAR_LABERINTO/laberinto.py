import numpy as np
import matplotlib.pyplot as plt
import json

def generate_maze(size):
    from scipy.ndimage import binary_dilation
    maze = np.random.choice([0, 1], size=(size, size), p=[0.7, 0.3])
    maze[0, 0] = 0  # Start
    maze[-1, -1] = 0  # Goal
    maze = binary_dilation(maze).astype(int)
    maze[0, 0] = 0  # Ensure start is open
    maze[-1, -1] = 0  # Ensure goal is open
    return maze

def save_maze_to_json(maze, filename):
    maze_list = maze.tolist()
    with open(filename, 'w') as f:
        json.dump(maze_list, f)

size = 20
maze = generate_maze(size)
save_maze_to_json(maze, 'maze.json')

plt.imshow(maze, cmap='binary')
plt.show()
