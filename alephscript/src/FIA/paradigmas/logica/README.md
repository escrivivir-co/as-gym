# Resolución (Prolog like)

```ts
 console.log(systemMessage(i18.SISTEMA.STARTING_LABEL));

    const resolverProlog = [
      "p(X, Y) := q(X) and r(Y, Z).",
      "p(X, Y) := q(X) and q(Y).",
      "q(a).",
      "r(a, b).",
      "r(b, b)."
    ]
    const resolverObjetivo = [
      "p(a, a)."
    ]
    const resolverObjetivo2 = [
      "p(X, Y)."
    ]
    const resolverObjetivo3 = [
      "p(X, b)."
    ]
    let objetivo = new Parser(resolverObjetivo);
    let objetivo2 = new Parser(resolverObjetivo2);
    let objetivo3 = new Parser(resolverObjetivo3);

    let parser = new Parser(resolverProlog);

    let o = objetivo.lineas.map(l => l.cabeza)[0]
    const r = new Resolver(o);
    r.resolver(
      "\t",
      [o],
      parser.lineas,
      r.nodo);

    r.imprimir()

    o = objetivo2.lineas.map(l => l.cabeza)[0];
    const r2 = new Resolver(o);
    r2.resolver(
      "\t",
      [o],
      parser.lineas,
      r2.nodo);

    r2.imprimir()

    o = objetivo3.lineas.map(l => l.cabeza)[0];
    const r3 = new Resolver(o);
    r3.resolver(
      "\t",
      [o],
      parser.lineas,
      r3.nodo);

    r3.imprimir()
```

```
sistema> Arrancando el sistema
         - Parser Programa (líneas entrada/salida) 1 / 1
                 - L: 1 p(a, a)
         - Parser Programa (líneas entrada/salida) 1 / 1
                 - L: 1 p(X, Y)
         - Parser Programa (líneas entrada/salida) 1 / 1
                 - L: 1 p(X, b)
         - Parser Programa (líneas entrada/salida) 5 / 5
                 - L: 1 p(X, Y) :> q(X), r(Y, Z)
                 - L: 2 p(X, Y) :> q(X), q(Y)
                 - L: 3 q(a)
                 - L: 4 r(a, b)
                 - L: 5 r(b, b)
                 - Resolver: objetivo p(a, a)
                 - Resolver: buscar regla o cláusual
                         - Resolver: regla p(X, Y) [ '<X, a>', '<Y, a>' ]
                         - Resolver: objetivos [ 'q(X)', 'r(Y, Z)' ]
                         - Resolver: aplicada lista [ 'q(a)', 'r(a, Z)' ]
                         - Resolver: objetivo q(a)
                         - Resolver: buscar regla o cláusual
                                 - Resolver: regla q(a) []
                                 - Resolver: objetivos [ 'r(a, Z)' ]
                                 - Resolver: aplicada lista [ 'r(a, Z)' ]
                                 - Resolver: objetivo r(a, Z)
                                 - Resolver: buscar regla o cláusual
                                         - Resolver: regla r(a, b) [ '<Z, b>' ]
                                         - Resolver: objetivos []
                                         - Resolver: aplicada lista []
                                                 - Resultado:  Cierto
                         - Resolver: regla p(X, Y) [ '<X, a>', '<Y, a>' ]
                         - Resolver: objetivos [ 'q(X)', 'q(Y)' ]
                         - Resolver: aplicada lista [ 'q(a)', 'q(a)' ]
                         - Resolver: objetivo q(a)
                         - Resolver: buscar regla o cláusual
                                 - Resolver: regla q(a) []
                                 - Resolver: objetivos [ 'q(a)' ]
                                 - Resolver: aplicada lista [ 'q(a)' ]
                                 - Resolver: objetivo q(a)
                                 - Resolver: buscar regla o cláusual
                                         - Resolver: regla q(a) []
                                         - Resolver: objetivos []
                                         - Resolver: aplicada lista []
                                                 - Resultado:  Cierto
         - Soluciones 2
                 - Solucion []
                 - Solucion []


                 - Resolver: objetivo p(X, Y)
                 - Resolver: buscar regla o cláusual
                         - Resolver: regla p(X, Y) []
                         - Resolver: objetivos [ 'q(X)', 'r(Y, Z)' ]
                         - Resolver: aplicada lista [ 'q(X)', 'r(Y, Z)' ]
                         - Resolver: objetivo q(X)
                         - Resolver: buscar regla o cláusual
                                 - Resolver: regla q(a) [ '<X, a>' ]
                                 - Resolver: objetivos [ 'r(Y, Z)' ]
                                 - Resolver: aplicada lista [ 'r(Y, Z)' ]
                                 - Resolver: objetivo r(Y, Z)
                                 - Resolver: buscar regla o cláusual
                                         - Resolver: regla r(a, b) [ '<Y, a>', '<Z, b>' ]
                                         - Resolver: objetivos []
                                         - Resolver: aplicada lista []
                                                 - Resultado:  Cierto
                                         - Resolver: regla r(b, b) [ '<Y, b>', '<Z, b>' ]
                                         - Resolver: objetivos []
                                         - Resolver: aplicada lista []
                                                 - Resultado:  Cierto
                         - Resolver: regla p(X, Y) []
                         - Resolver: objetivos [ 'q(X)', 'q(Y)' ]
                         - Resolver: aplicada lista [ 'q(X)', 'q(Y)' ]
                         - Resolver: objetivo q(X)
                         - Resolver: buscar regla o cláusual
                                 - Resolver: regla q(a) [ '<X, a>' ]
                                 - Resolver: objetivos [ 'q(Y)' ]
                                 - Resolver: aplicada lista [ 'q(Y)' ]
                                 - Resolver: objetivo q(Y)
                                 - Resolver: buscar regla o cláusual
                                         - Resolver: regla q(a) [ '<Y, a>' ]
                                         - Resolver: objetivos []
                                         - Resolver: aplicada lista []
                                                 - Resultado:  Cierto
         - Soluciones 3
                 - Solucion [ '<Y, a>', '<X, a>' ]
                 - Solucion [ '<Y, b>', '<X, a>' ]
                 - Solucion [ '<Y, a>', '<X, a>' ]


                 - Resolver: objetivo p(X, b)
                 - Resolver: buscar regla o cláusual
                         - Resolver: regla p(X, Y) [ '<Y, b>' ]
                         - Resolver: objetivos [ 'q(X)', 'r(Y, Z)' ]
                         - Resolver: aplicada lista [ 'q(X)', 'r(b, Z)' ]
                         - Resolver: objetivo q(X)
                         - Resolver: buscar regla o cláusual
                                 - Resolver: regla q(a) [ '<X, a>' ]
                                 - Resolver: objetivos [ 'r(b, Z)' ]
                                 - Resolver: aplicada lista [ 'r(b, Z)' ]
                                 - Resolver: objetivo r(b, Z)
                                 - Resolver: buscar regla o cláusual
                                         - Resolver: regla r(b, b) [ '<Z, b>' ]
                                         - Resolver: objetivos []
                                         - Resolver: aplicada lista []
                                                 - Resultado:  Cierto
                         - Resolver: regla p(X, Y) [ '<Y, b>' ]
                         - Resolver: objetivos [ 'q(X)', 'q(Y)' ]
                         - Resolver: aplicada lista [ 'q(X)', 'q(b)' ]
                         - Resolver: objetivo q(X)
                         - Resolver: buscar regla o cláusual
                                 - Resolver: regla q(a) [ '<X, a>' ]
                                 - Resolver: objetivos [ 'q(b)' ]
                                 - Resolver: aplicada lista [ 'q(b)' ]
                                 - Resolver: objetivo q(b)
                                 - Resolver: buscar regla o cláusual
         - Soluciones 1
                 - Solucion [ '<X, a>' ]


```