import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

export class BaseDic {
    indexFilePath: string;
    dictFilePath: string;

    constructor(
        index: string = './data/dictionaries/spa-eng/spa-eng.index',
        dic: string = './data/dictionaries/spa-eng/spa-eng.dict.dz'
    ) {
        this.indexFilePath = path.join(__dirname, index);
        this.dictFilePath = path.join(__dirname, dic);
    }

    // Function to load the index file and parse it
    loadIndex(filePath: string) {
        const indexData = fs.readFileSync(filePath, 'utf-8');
        const entries = indexData.split('\n').filter(Boolean).map(line => {
            const [word, offset] = line.split('\t');
            return { word, offset: parseInt(offset, 10) };
        });
        return entries;
    }

    // Function to read and decompress the dictionary at a specific offset
    readDictEntry(filePath: string, offset: number) {
        const dictStream = fs.createReadStream(filePath);
        const unzip = zlib.createGunzip();

        return new Promise<string>((resolve, reject) => {
            let buffer = Buffer.alloc(0); // Initialize empty buffer
            let bytesRead = 0;

            dictStream.pipe(unzip);

            unzip.on('data', (chunk) => {
                bytesRead += chunk.length;
                if (bytesRead >= offset) {
                    buffer = Buffer.concat([buffer, chunk.slice(bytesRead - offset)]);

                    const translation = buffer.toString('utf-8').split('\0')[0];
                    resolve(translation);
                }
            });

            unzip.on('end', () => resolve(''));

            unzip.on('error', (err) => reject(err));
        });
    }

    // Method to print first 10 items in the dictionary file directly
    testDictContents() {
        const dictStream = fs.createReadStream(this.dictFilePath);
        const unzip = zlib.createGunzip();

        dictStream.pipe(unzip);

        let buffer = Buffer.alloc(0);
        let items = 0;

        unzip.on('data', (chunk) => {
            buffer = Buffer.concat([buffer, chunk]);

            // Split the buffer into null-terminated strings
            const entries = buffer.toString('utf-8').split('\0');

            entries.forEach((entry) => {
                if (entry.trim() !== '' && items < 1) {
					console.log(`=======================================`);
                    console.log(`Dictionary Entry #${items + 1}: ${entry.trim()}`);
                    items++;
                }
            });

            if (items >= 10) {
                unzip.close(); // Stop reading after 10 entries
            }
        });

        unzip.on('error', (err) => {
            console.error('Error reading dictionary:', err);
        });
    }

    async run() {
        const indexEntries = this.loadIndex(this.indexFilePath);

		let i = 0;
        for (const entry of indexEntries) {
			i++;
			if (i > 25) break;
            try {
                const translation = await this.readDictEntry(this.dictFilePath, entry.offset);
                console.log(`Spanish word: ${entry.word} => English translation: ${translation}`);
            } catch (err) {
                console.error(`Error processing word ${entry.word}:`, err);
            }
        }
    }
}


