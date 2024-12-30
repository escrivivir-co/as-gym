import puppeteer from 'puppeteer';
import { Control } from '../busquedas/control';
import { BGrafo } from '../busquedas/GrafoS';
import { Operador } from '../busquedas/operador';
import { RTCache } from '../../../engine/kernel/rt-cache';
import { sLinea } from '../../logica/resolucion/parser';

export interface EnlaceW {
    id: string;
    text: string;
}
export class WebScraper {

	rc = new RTCache();
	enlaces: EnlaceW[] = [];
	enlaceso: EnlaceW[] = [];

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
			.slice(0, 20)

            // console.log("Went to url, done!", enlaces, externos);
        // Cierra el navegador
        await browser.close();
        return { oute, exte };
    }

	async ejecutar(URL: string): Promise<BGrafo> {

		// Uso de la clase
		return await (async () => {


			this.rc.archivo = "/Users/morente/Desktop/THEIA_PATH/AlephWeb/angular-app/alephscript/src/FIA/paradigmas/sistemas/scraper/cache.json";
			this.rc.recuperar2();
			console.log("Dominio", this.rc.dominio.base[URL]?.length, this.rc.leer(URL)?.length)

			const scraper = this;

			let enlaces = this.rc.leer(URL)?.enlaces;
			let externos = this.rc.leer(URL)?.externos;

			if (!enlaces) {

				console.log("No cacheado, recuperando datos...", URL)
				const { oute, exte } = await scraper.extraerEnlaces(URL);
				console.log("Went to url, done!", enlaces, externos);
				const eMap = {};
				oute.forEach(a => { eMap[a.id] = a.text });

				enlaces = oute;
				externos = exte.slice(0, 20);

				this.rc.guardar(URL, { enlaces, externos });
				this.rc.persistirRuta();

			} else {
				console.log("- Recuperando de cache", URL);
			};

			const g = new BGrafo();
			const c = new Control(g);

			console.log("Crea nodo para URL", URL)
			const A = c.creaNodoE(URL, 0);

			externos.forEach(e => {
				console.log("Crea nodo para URL HIJO", JSON.stringify(e))
				const B = c.creaNodoE(e.id, 1);
				A.arcos.push(new Operador(1, B));
			})
			this.enlaces = enlaces;
			this.enlaceso = externos;

			console.log("Nº Enlaces");
			console.log("Internos", A.arcos.length, "externos", externos.length);
			return A;
		})();
	}
}


