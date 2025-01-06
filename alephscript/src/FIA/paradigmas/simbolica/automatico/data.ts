interface Instance {
    attributes: string[];
    label: string;
}

type Hypothesis = string[];


function versionSpaceLearning(trainingData: Instance[]): { S: Hypothesis[], G: Hypothesis[] } {

    // console.log("Inicializar G")
    let G: Hypothesis[] = [Array(trainingData[0].attributes.length).fill('?')]; // Más general
    console.log("G0:", G);

    // console.log("Inicializar S")
    let S: Hypothesis[] = [];
    console.log("S0:", S);

    let index = 1;
    for (const instance of trainingData) {

        console.log('\t - ', instance);

        if (instance.label === '+') {

            // console.log('\t\t - Especializar G:');
            G = specializeGPositive(G, instance)
            console.log('\t\t\t - G' + index + ':', G);

            // console.log('\t\t - Generalizar S:');
            S = generalizeSPositive(S, instance)
            console.log('\t\t\t - S' + index + ':', S);

            // G = G.filter(h => isCovered(h, instance));

            // S = generalizeS(S, instance);

            // S = S.filter(s => !G.some(g => isMoreGeneral(s, g)));

        } else {

            // console.log('\t\t - Generalizar S:');
            S = generalizeSNegative(S, instance)
            console.log('\t\t\t - S' + index + ':', S);

            // console.log('\t\t - Especializar G:');
            G = specializeGNegative(G, S, instance)
            console.log('\t\t\t - G' + index + ':', G);          
            

            // S = S.filter(h => !isCovered(h, instance));

            // G = specializeG(G, instance);

            // G = G.filter(g => !S.some(s => isMoreGeneral(s, g)));

        }

        if (G == S) {
            console.log("Acabado G == S", G);
            break;
        }

        // G = deduplicate(G);

        // if (S.length === 0) {
        //    S = [Array(trainingData[0].attributes.length).fill('?')];
        //}
        index++;

    }

    return { S, G };
}

function isCovered(hypothesis: Hypothesis, instance: Instance): boolean {
    return hypothesis.every((val, i) => val === '?' || val === instance.attributes[i]);
}

function isCoveredNegative(hypothesis: Hypothesis, instance: Instance): boolean {
    if (hypothesis.every((val, i) => val === '?')){
        return false;
    }
    return hypothesis.every((val, i) => val === '?' || val === instance.attributes[i]);
}

function isMoreGeneral(h1: Hypothesis, h2: Hypothesis): boolean {
    let moreGeneral = false;
    for (let i = 0; i < h1.length; i++) {
        if (h1[i] !== '?' && h1[i] !== h2[i]) {
            return false;
        }
        if (h1[i] === '?' && h2[i] !== '?') {
            moreGeneral = true;
        }
    }
    return moreGeneral;
}

function generalizeSPositive(S: Hypothesis[], instance: Instance): Hypothesis[] {

    // console.log("\t\t\t\t - Eliminar las que no cubren a instance");
    const original = S.length
    const sfil = S.filter(h => !isCovered(h, instance));
    const filtered = sfil.length
    // console.log("\t\t\t\t\t - Existentes, Resultantes", original, filtered, sfil);

    // console.log("\t\t\t\t - Agregar las generalizaciones maximales consistentes con instance");
    const atout = [...instance.attributes];
    for (let i = 0; i < instance.attributes.length; i++) {

        const at = instance.attributes[i];
        // console.log("\t\t\t\t\t - ", i, at);

        const s = sfil.filter(h => h[i] !== at);
        // console.log("\t\t\t\t\t - Diferentes", s.length, s);

        if (s.length == 0) {
            atout[i] = at;
        } else {
            atout[i] = '?';
        }
    }
    // console.log("\t\t\t\t - ", atout);
    S.push(atout);

    return [atout];
}

function generalizeSNegative(S: Hypothesis[], instance: Instance): Hypothesis[] {

    // console.log("\t\t\t\t - Eliminar las que no cubren a instance");
    const original = S.length
    S = S.filter(h => !isCovered(h, instance));
    const filtered = S.length
    // console.log("\t\t\t\t\t - Existentes, Resultantes", original, filtered);

    return S;
}


function specializeGPositive(G: Hypothesis[], instance: Instance): Hypothesis[] {
    const consistentHypotheses: Hypothesis[] = [];

    for (const hypothesis of G) {
        let isConsistent = true;

        for (let i = 0; i < hypothesis.length; i++) {
            if (hypothesis[i] !== '?' && hypothesis[i] !== instance.attributes[i]) {
                isConsistent = false;
                break;
            }
        }

        if (isConsistent) {
            consistentHypotheses.push(hypothesis);
            // console.log(`\t\t\t\t - Hypothesis ${hypothesis} is consistent with instance`);
        } else {
            // console.log(`\t\t\t\t - Hypothesis ${hypothesis} is not consistent with instance`);
        }
    }

    return consistentHypotheses;
}

function specializeGNegative(G: Hypothesis[], S: Hypothesis[], instance: Instance): Hypothesis[] {

    // console.log(`\t\t\t\t - G `, G);
    const Gout =  G.filter(h => isCoveredNegative(h, instance));
    // console.log(`\t\t\t\t - G ini/filter `, G.length, Gout.length);
    
    const add = Gout.length == 0;
    for (let i = 0; i < instance.attributes.length; i++) {

        const s = S.filter(h => h[i] !== instance.attributes[i]);
        // console.log("\t\t\t\t - Negaciones de ", instance.attributes[i], ": ", s.length);

        if (s.length > 0) {

            s.forEach(h => {
                const newg = h.map(
                    (val, j) => {
                        if (j === i) {
                            return h[j];
                        }
                        return '?';
                    }
                )
                const dife = newg.every((val, i) => {
                    //console.log(newg, val, val[i], i)
                    return val === '?'}
                )
                if (!dife) {

                    if (add) {

                        Gout.push(newg)

                    } else {

                        for(let i = 0; i < Gout.length; i++){
                            for(let y = 0; y < newg.length; y++){
                                if (newg[y] != '?') {
                                    Gout[i][y] = newg[y]
                                }
                            }                            
                        }
                    }
                        
                    // console.log("difes", newg)
                } else {
                    // console.log("iguales", newg)
                }

                // console.log("\t\t\t\t\t - Negaciones de ", instance.attributes[i], ": ", newg);
            });
            
        }

    }

    return Gout;
}

function deduplicate(hypotheses: Hypothesis[]): Hypothesis[] {
    const seen = new Set();
    return hypotheses.filter(h => {
        const key = h.join(',');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

const trainingData: Instance[] = [
    { attributes: ['Japón', 'Honda', 'Azul', '1980', 'Económico'], label: '+' },
    { attributes: ['Japón', 'Toyota', 'Verde', '1970', 'Deportivo'], label: '-' },
    { attributes: ['Japón', 'Toyota', 'Azul', '1990', 'Económico'], label: '+' },
    { attributes: ['EEUU', 'Chrysler', 'Azul', '1980', 'Económico'], label: '-' },
    { attributes: ['Japón', 'Honda', 'Blanco', '1980', 'Económico'], label: '+' }
];


let { S, G } = versionSpaceLearning(trainingData);
const Sexpected =  [ [ 'Japón', '?', '?', '?', 'Económico' ] ];
const Gexpected =  [ [ 'Japón', '?', '?', '?', 'Económico' ] ];
console.log("The result is: ", S, G, 
    "Expected Test S:", areSGEqual(S, Sexpected),
    "Expected Test G:", areSGEqual(G, Gexpected)
);

function areSGEqual(S: Hypothesis[], G: Hypothesis[]): boolean {
    if (S.length !== G.length) {
        return false;
    }

    for (let i = 0; i < S.length; i++) {
        if (S[i].join(',') !== G[i].join(',')) {
            return false;
        }
    }

    return true;
}

const trainingData2: Instance[] = [
    { attributes: ['roja', 'dulce', 'mediana'], label: '+' },
    { attributes: ['roja', 'dulce', 'pequeña'], label: '+' },
    { attributes: ['roja', 'amarga', 'mediana'], label: '-' },
    { attributes: ['naranja', 'dulce', 'pequeña'], label: '-' }
];

const c  = versionSpaceLearning(trainingData2);
const S1expected =  [ [ 'roja', 'dulce', '?' ] ];
const G1expected =  [ [ 'roja', 'dulce', '?' ] ];
console.log("The result is: ", c, 
    "Expected Test S:", areSGEqual(c.S, S1expected),
    "Expected Test G:", areSGEqual(c.G, G1expected)
);

const trainingData3: Instance[] = [
    { attributes: ['Sí', 'Sí', 'Sí', 'Sí', 'Sí'], label: '+' },  // d1 - Elefante
    { attributes: ['Sí', 'Sí', 'Sí', 'No', 'Sí'], label: '+' },  // d2 - Elefante
    { attributes: ['Sí', 'Sí', 'No', 'No', 'Sí'], label: '-' },  // d3 - Ratón
    { attributes: ['No', 'Sí', 'Sí', 'Sí', 'Sí'], label: '-' },  // d4 - Jirafa
    { attributes: ['Sí', 'No', 'Sí', 'No', 'Sí'], label: '-' },  // d5 - Dinosaurio
    { attributes: ['Sí', 'Sí', 'Sí', 'Sí', 'No'], label: '+' },  // d6 - Elefante
];

const c2  = versionSpaceLearning(trainingData3);
const S2expected = [ [ 'Sí', 'Sí', 'Sí', '?', '?' ] ];
const G2expected = [ [ 'Sí', 'Sí', 'Sí', '?', '?' ] ];
console.log("The result is: ", c2, 
    "Expected Test S:", areSGEqual(c2.S, S2expected),
    "Expected Test G:", areSGEqual(c2.G, G2expected)
);



const testData: Instance[] = [
    { attributes: ['Alemania', 'Honda', 'Azul', '2000', 'Económico'], label: '?' },
    { attributes: ['Japón', 'Suzyki', 'Blanco', '1970', 'Económico'], label: '?' },
    { attributes: ['Alemania', 'Audi', 'rojo', '1990', 'Deportivo'], label: '?' }
];


function validarInstance(S: Hypothesis[], G: Hypothesis[], instances: Instance[]): void {

    if (areSGEqual(S, G)) {
        console.log(`Comprobando para CONCEPTO APRENDIDO`);
    } else {
        console.log(`Comprobando para MARGEN CONCEPTO DELIMITADO`);
        console.log(`\t - S, G`, S, G);
    }

    for (const instance of instances) {

        let isPositive = false;
        let isNegative = false;

        for (const hypothesis of S) {

            console.log(`\t - Checking if S hypothesis ${hypothesis} covers instance ${instance.attributes}`);
            if (isCovered(hypothesis, instance)) {
                isPositive = true;
                console.log(`\t\t - S hypothesis ${hypothesis} covers instance ${instance.attributes}`);
                break;
            }
        }

        if (areSGEqual) {
            instance.label = isPositive ? '+' : '-';
            continue;
        }

        for (const hypothesis of G) {
            console.log(`\t - Checking if G hypothesis ${hypothesis} covers instance ${instance.attributes}`);
            if (isCovered(hypothesis, instance)) {
                isNegative = true;
                console.log(`\t\t - G hypothesis ${hypothesis} covers instance ${instance.attributes}`);
                break;
            }
        }

        if (S != G && isPositive && isNegative) {
            instance.label = '?';
            console.log(`Instance ${instance.attributes} is labeled as '?'`);
        } else if (isPositive) {
            instance.label = '+';
            console.log(`Instance ${instance.attributes} is labeled as '+'`);
        } else if (isNegative) {
            instance.label = '-';
            console.log(`Instance ${instance.attributes} is labeled as '-'`);
        }
    }
}

validarInstance(S, G, testData);

console.log("Resultado: ", testData);
