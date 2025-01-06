#!/bin/bash

# Find and remove all files named ._.DS_Store recursively
find . -name "._.DS_Store" -exec rm -f {} \;

echo "All ._.DS_Store files have been removed."
