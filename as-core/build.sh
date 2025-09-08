#!/bin/bash

echo "Building FIA AI Framework Monorepo..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build packages in dependency order
echo "Building @fia/core..."
cd packages/core && npm install && npm run build
cd ../..

echo "Building @fia/i18n..."
cd packages/i18n && npm install && npm run build
cd ../..

echo "Building @fia/runtime..."
cd packages/runtime && npm install && npm run build
cd ../..

echo "Building @fia/mundo..."
cd packages/mundo && npm install && npm run build
cd ../..

echo "Building @fia/search-algorithms..."
cd packages/search-algorithms && npm install && npm run build
cd ../..

echo "Building @fia/machine-learning..."
cd packages/machine-learning && npm install && npm run build
cd ../..

echo "Building @fia/grammars..."
cd packages/grammars && npm install && npm run build
cd ../..

echo "Building @fia/devops..."
cd packages/devops && npm install && npm run build
cd ../..

echo "Building @fia/launcher..."
cd apps/launcher && npm install && npm run build
cd ../..

echo "Build completed!"
