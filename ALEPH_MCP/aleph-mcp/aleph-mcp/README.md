# Aleph MCP

Un servidor implementado con el Model Context Protocol (MCP) que proporciona herramientas para análisis de código, documentación y plantillas de prompts.

## Características

- Implementación completa del protocolo MCP
- Herramientas para análisis de código
- Herramientas para documentación
- Plantillas de prompts precargadas
- Cliente CLI para interactuar con el servidor

## Estructura del proyecto

```
aleph-mcp/
├── src/                     # Código fuente
│   ├── client/              # Cliente MCP
│   ├── server/              # Servidor MCP
│   ├── tools/               # Herramientas disponibles
│   │   ├── code-tools.ts
│   │   ├── documentation-tools.ts
│   │   └── prompt-tools.ts
│   ├── types/               # Definiciones de tipos
│   ├── client-cli.ts        # Cliente de línea de comandos
│   ├── index.ts             # Punto de entrada principal
│   ├── types.ts             # Tipos globales
│   └── utils.ts             # Utilidades compartidas
├── .env.example             # Ejemplo de variables de entorno
├── .prettierrc              # Configuración de Prettier
├── eslint.config.js         # Configuración de ESLint
├── package.json             # Dependencias y scripts
├── tsconfig.json            # Configuración de TypeScript
└── README.md                # Este archivo
```

## Requisitos

- Node.js 18.x o superior
- npm 8.x o superior

## Instalación

```bash
# Clonar el repositorio
git clone https://your-repository-url/aleph-mcp.git
cd aleph-mcp

# Instalar dependencias
npm install

# Copiar el archivo de ejemplo de variables de entorno
cp .env.example .env
```

## Desarrollo

El proyecto incluye varios scripts para facilitar el desarrollo:

```bash
# Iniciar el servidor en modo desarrollo (con hot-reload)
npm run dev

# Iniciar el cliente CLI en modo desarrollo
npm run client:dev

# Limpiar la carpeta de distribución
npm run clean

# Compilar el proyecto
npm run build

# Ejecutar pruebas
npm run test

# Ejecutar linting
npm run lint

# Formatear el código
npm run format
```

## Producción

Para construir y ejecutar el proyecto en producción:

```bash
# Compilar el proyecto
npm run build

# Iniciar el servidor
npm start

# Iniciar el cliente CLI
npm run client
```

## Contribuir

Las contribuciones son bienvenidas. Por favor, asegúrate de seguir las directrices de estilo y añadir pruebas para cualquier nueva funcionalidad.

## Licencia

MIT