import * as http from "http";
import { i18 } from "../../i18/aleph-script-i18";
import { systemMessage } from "../../systemMessage";
import { Resolver } from "./resolucion/resolver";
import { Parser } from "./resolucion/parser";

const host = 'localhost';
const port = 8000;

const requestListener =  (req, res) => {
    res.writeHead(200);

    res.end("My first server!");
};

const server = http.createServer(requestListener);

server.on('error', (e) => {

  // Handle Error
  console.log(console.log("Thread Handle Error:", systemMessage(e.message)));

});
server.listen(port, async () => {

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
  });

