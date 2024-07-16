import puppeteer from 'puppeteer';
import { Control } from '../busquedas/control';
import { BGrafo } from '../busquedas/GrafoS';
import { Operador } from '../busquedas/operador';
import { RTCache } from '../../../engine/kernel/rt-cache';
import { i18 } from '../../../i18/aleph-script-i18';
import { systemMessage } from '../../../systemMessage';
import * as http from "http";

class WebScraper {
    // Método asincrónico para extraer enlaces de una URL dada
    async extraerEnlaces(url: string): Promise<any> {
        // Inicia Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navega a la URL
        await page.goto(url);

        console.log("Went to url");
        // Extrae los enlaces
        let exte = []
        const enlaces = await page.evaluate(() => {

            const anchors = Array.from(document.querySelectorAll('a'));
            return anchors
                .map(anchor => { return { id: anchor.href, text: anchor.innerHTML}});

        });


        // console.log("The anchors", enlaces.length, enlaces[1]);
        exte = enlaces.filter(e =>  e.id.indexOf(url) == - 1 );

        const oute = enlaces
            .filter(e => e.id.indexOf(url) != - 1 )
            .map(e => { return {
                ...e,
                id: (e.id + "").replace(url, "")
            }})

            // console.log("Went to url, done!", enlaces, externos);
        // Cierra el navegador
        await browser.close();
        return { oute, exte };
    }
}

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

 
// Uso de la clase
await (async () => {

    const rc = new RTCache();
    const URL = 'https://n0sce.com';
    rc.archivo = "/Users/morente/Desktop/THEIA_PATH/taller_tc/JE20/je20/fia/src/FIA/paradigmas/sistemas/scraper/datos.json";
    rc.recuperar2();
    console.log("Dominio", rc.dominio.base[URL]?.length, rc.leer(URL)?.length)


    const scraper = new WebScraper();

    let enlaces = rc.leer(URL)?.enlaces;
    let externos = rc.leer(URL)?.externos;

    if (!enlaces) {

        console.log("No cacheado, recuperando datos...", URL)
        const { oute, exte } = await scraper.extraerEnlaces(URL);
        // console.log("Went to url, done!", enlaces, externos);
        const eMap = {};
        oute.forEach(a => { eMap[a.id] = a.text });

        enlaces = oute;
        externos = exte;

        rc.guardar(URL, { enlaces, externos });
        rc.persistirRuta();

    } else {
        console.log("- Recuperando de cache", URL);
    };

    const g = new BGrafo();
    const c = new Control(g);

    const A = c.creaNodoE(URL, 0);

    enlaces.forEach(e => {

        const B = c.creaNodoE(JSON.stringify(e), 1);
        A.arcos.push(new Operador(1, B));
    })

    console.log("Nº Enlaces");
    console.log("Internos", A.arcos.length, "externos", externos.length);
})();

});
