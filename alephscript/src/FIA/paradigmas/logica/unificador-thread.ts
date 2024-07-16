import { i18 } from "../../i18/aleph-script-i18";
import { systemMessage } from "../../systemMessage";
import { Parser } from "./resolucion/parser";


import * as http from "http";
import { UnificadorGeneral } from "./unificador/unificacion-general";

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

    const unificadorTestDummy = [
      "P(a, X, f(g(Y))).",
      "P(a, X, f(g(Y)))."
    ]
    let parser = new Parser(unificadorTestDummy);

    let unificador = new UnificadorGeneral();

    let test = unificador.unificar(
        parser.lineas[0].cabeza,
        parser.lineas[1].cabeza
    )
    console.log("Test, sí", test.unificable == true)


    const unificadorTestSimple = [
      "P(a, X, f(g(Y))).",
      "P(Z, f(Z)X, f(U))."
    ]
    parser = new Parser(unificadorTestSimple);

    unificador = new UnificadorGeneral();

    test = unificador.unificar(
        parser.lineas[0].cabeza,
        parser.lineas[1].cabeza
    )
    console.log("Test, sí", test.unificable == true)

    const unificadorTestNegativo = [
      "P(X, f(X), X).",
      "P(U, W, W)."
    ]
    parser = new Parser(unificadorTestNegativo);

    unificador = new UnificadorGeneral();

    test = unificador.unificar(
        parser.lineas[0].cabeza,
        parser.lineas[1].cabeza
    )
    console.log("Test, No unificable", test.unificable == false)


  });

