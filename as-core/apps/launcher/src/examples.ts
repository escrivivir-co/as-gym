/**
 * Example usage of FIA Framework components
 */

import { Runtime } from '@fia/runtime';
import { CandidateElimination } from '@fia/machine-learning';
import { AutomataAritmetico, automataAritmeticoX } from '@fia/grammars';
import { PrimeroEnAnchura, AEstrella } from '@fia/search-algorithms';
import { DevOpsFileManager } from '@fia/devops';
import { Mundo } from '@fia/mundo';
import { i18, systemMessage } from '@fia/i18n';

async function exampleUsage() {
    console.log(systemMessage(i18.SISTEMA.STARTING_LABEL));

    // 1. Runtime example
    console.log("\n=== Runtime Example ===");
    const rt = new Runtime();
    rt.start();
    await rt.demo();

    // 2. Machine Learning example  
    console.log("\n=== Machine Learning Example ===");
    const ml = new CandidateElimination();
    ml.test();
    ml.test2();

    // 3. Grammar example
    console.log("\n=== Grammar Example ===");
    const grammar = new AutomataAritmetico();
    grammar.iniciar();
    
    automataAritmeticoX.iniciar2();

    // 4. Search algorithms example
    console.log("\n=== Search Algorithms Example ===");
    const bfs = new PrimeroEnAnchura();
    bfs.test();
    
    const astar = new AEstrella();
    astar.test();

    // 5. DevOps example
    console.log("\n=== DevOps Example ===");
    const devops = new DevOpsFileManager();
    devops.test();

    // 6. World example
    console.log("\n=== World Example ===");
    const mundo = new Mundo("Example World");
    mundo.actualizar({ temperature: 25, humidity: 60 });
    mundo.test();

    console.log(systemMessage("All examples completed successfully!"));
}

if (require.main === module) {
    exampleUsage().catch(console.error);
}
