# aleph-mcp

## Overview

The `aleph-mcp` project implements a Model Context Protocol (MCP) server using TypeScript. This server facilitates the connection between language models and external data sources, allowing for enhanced interaction and functionality.

## Project Structure

```
aleph-mcp
├── src
│   ├── index.ts                  # Main entry point
│   ├── server
│   │   ├── mcp-server.ts         # MCP server implementation
│   │   └── transport.ts          # Server transport handling
│   ├── tools
│   │   ├── code-tools.ts         # Code analysis tools
│   │   ├── documentation-tools.ts # Documentation retrieval tools
│   │   └── prompt-tools.ts       # Tools to simulate prompts
│   ├── utils
│   │   ├── cache.ts              # Caching utilities
│   │   └── templates.ts          # Template handling functions
│   ├── types
│   │   └── index.ts              # Type definitions
│   └── client
│       └── test-client.ts        # Client for testing
├── examples
│   └── prompt-templates.json     # Example prompt templates
├── tests
│   ├── server.test.ts            # Server tests
│   └── tools.test.ts             # Tools tests
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

To set up the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd aleph-mcp
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Usage

To start the MCP server, run the following command:

```bash
npm start
```

This will initialize the server and make it ready to accept connections from clients.

## Tools

The project includes several tools for different functionalities:

- **Code Analysis Tools**: Located in `src/tools/code-tools.ts`, these tools provide functionalities like analyzing code snippets.
  
- **Documentation Tools**: Found in `src/tools/documentation-tools.ts`, these tools help retrieve documentation based on specific topics.

- **Prompt Tools**: Implemented in `src/tools/prompt-tools.ts`, these tools manage prompt templates and allow for their simulation.

## Testing

To run the tests, use the following command:

```bash
npm test
```

This will execute the unit tests defined in the `tests` directory, ensuring that the server and tools function as expected.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.