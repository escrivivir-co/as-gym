/*import si from 'systeminformation';
import fs from 'fs';
import { performance } from 'perf_hooks';
import diskusage from 'diskusage';
import speedTest from 'speedtest-net';
import { GPU } from 'gpu.js';

interface BenchmarkResult {
    cpuScore: number;
    ramScore: number;
    gpuScore: number;
    storageScore: number;
    networkScore: number;
}

export interface ExpectedBenchmark {
    cpuScore: number;
    ramScore: number;
    gpuScore: number;
    storageScore: number;
    networkScore: number;
}

export class HostMonitor {
    private report: any;

    constructor() {
        this.report = {};
    }

    private async getCPUInfo(): Promise<any> {
        const cpu = await si.cpu();
        return { model: cpu.manufacturer + ' ' + cpu.brand, speed: cpu.speed, cores: cpu.cores };
    }

    private async getRAMInfo(): Promise<any> {
        const mem = await si.mem();
        return { totalRAM: mem.total, freeRAM: mem.free };
    }

    private async getGPUInfo(): Promise<any> {
        const graphics = await si.graphics();
        if (graphics.controllers.length > 0) {
            const gpu = graphics.controllers[0];
            return { model: gpu.model, vram: gpu.vram, bus: gpu.bus };
        } else {
            return { model: 'No GPU found' };
        }
    }

    private async getStorageInfo(): Promise<any> {
        const disks = await si.diskLayout();
        const fsSizes = await si.fsSize();
        return { disks, fsSizes };
    }

    private async getNetworkInfo(): Promise<any> {
        const networkInterfaces = await si.networkInterfaces();
        const networkStats = await si.networkStats();
        return { networkInterfaces, networkStats };
    }

    private runCPUBenchmark(): Promise<number> {
        return new Promise((resolve) => {
            const start = performance.now();
            let x = 0;
            for (let i = 0; i < 1e7; i++) {
                x += Math.sqrt(i);
            }
            const end = performance.now();
            const score = 1000 / (end - start); // Invertir el tiempo para obtener una puntuación más alta
            resolve(score);
        });
    }

    private runRAMBenchmark(): Promise<number> {
        return new Promise((resolve) => {
            const arraySize = 100 * 1024 * 1024; // 100 MB
            const buffer = new ArrayBuffer(arraySize);
            const view = new Uint8Array(buffer);
            const start = performance.now();
            for (let i = 0; i < arraySize; i++) {
                view[i] = i % 256;
            }
            const end = performance.now();
            const score = 1000 / (end - start); // Invertir el tiempo para obtener una puntuación más alta
            resolve(score);
        });
    }

    private runStorageBenchmark(): Promise<number> {
        return new Promise((resolve) => {
            diskusage.check('/', (err, info) => {
                if (err) {
                    console.error(`Storage Benchmark error: ${err}`);
                    resolve(0);
                    return;
                }
                const score = (info.total - info.available) / info.total * 100;
                resolve(score);
            });
        });
    }

    private async runNetworkBenchmark(): Promise<number> {
        const result = await speedTest({ acceptLicense: true, acceptGdpr: true });
        if (result && result.download) {
            return result.download.bandwidth / 125000; // Convert from bytes/sec to Mbps
        } else {
            console.error(`Network Benchmark error: No valid result`);
            return 0;
        }
    }

    private runGPUBenchmark(): Promise<number> {
        return new Promise((resolve) => {
            const gpu = new GPU();
            const size = 512;
            const benchmarkKernel = gpu.createKernel(function (a: number[][], b: number[][]) {
                let sum = 0;
                for (let i = 0; i < 512; i++) {
                    sum += a[this.thread.y][i] * b[i][this.thread.x];
                }
                return sum;
            }).setOutput([size, size]);

            const a = Array.from({ length: size }, () => Array.from({ length: size }, () => Math.random()));
            const b = Array.from({ length: size }, () => Array.from({ length: size }, () => Math.random()));

            const startTime = performance.now();
            benchmarkKernel(a, b);
            const endTime = performance.now();

            const timeTaken = endTime - startTime;
            const score = 1000 / timeTaken; // Invertir el tiempo para obtener una puntuación más alta

            resolve(score);
        });
    }

    private async runBenchmark(): Promise<BenchmarkResult> {
        const cpuScore = await this.runCPUBenchmark();
        const ramScore = await this.runRAMBenchmark();
        const gpuScore = await this.runGPUBenchmark();
        const storageScore = await this.runStorageBenchmark();
        const networkScore = await this.runNetworkBenchmark();

        return { cpuScore, ramScore, gpuScore, storageScore, networkScore };
    }

    private compareWithExpected(benchmark: BenchmarkResult, expected: ExpectedBenchmark): string {
        const cpuComparison = benchmark.cpuScore >= expected.cpuScore ? 'CPU is performing well.' : 'CPU performance is below expected.';
        const ramComparison = benchmark.ramScore >= expected.ramScore ? 'RAM is performing well.' : 'RAM performance is below expected.';
        const gpuComparison = benchmark.gpuScore >= expected.gpuScore ? 'GPU is performing well.' : 'GPU performance is below expected.';
        const storageComparison = benchmark.storageScore >= expected.storageScore ? 'Storage is performing well.' : 'Storage performance is below expected.';
        const networkComparison = benchmark.networkScore >= expected.networkScore ? 'Network is performing well.' : 'Network performance is below expected.';
        return `${cpuComparison}\n${ramComparison}\n${gpuComparison}\n${storageComparison}\n${networkComparison}`;
    }

    public async generateReport(expected: ExpectedBenchmark): Promise<void> {
        const cpuInfo = await this.getCPUInfo();
        const ramInfo = await this.getRAMInfo();
        const gpuInfo = await this.getGPUInfo();
        const storageInfo = await this.getStorageInfo();
        const networkInfo = await this.getNetworkInfo();
        const benchmark = await this.runBenchmark();
        const comparison = this.compareWithExpected(benchmark, expected);

        this.report = {
            cpuInfo,
            ramInfo,
            gpuInfo,
            storageInfo,
            networkInfo,
            benchmark,
            comparison
        };

        // Generate human-readable report in Markdown format
        const markdownReport = `
# Host Status Report

## CPU Info
- Model: ${cpuInfo.model}
- Speed: ${cpuInfo.speed} GHz
- Cores: ${cpuInfo.cores}

## RAM Info
- Total RAM: ${(ramInfo.totalRAM / (1024 ** 3)).toFixed(2)} GB
- Free RAM: ${(ramInfo.freeRAM / (1024 ** 3)).toFixed(2)} GB

## GPU Info
- Model: ${gpuInfo.model}
- VRAM: ${gpuInfo.vram ? gpuInfo.vram + ' MB' : 'N/A'}
- Bus: ${gpuInfo.bus ? gpuInfo.bus : 'N/A'}

## Storage Info
- Disks: 
${storageInfo.disks.map((disk: any) => `  - ${disk.device}: ${disk.size / (1024 ** 3)} GB`).join('\n')}
- File System Sizes:
${storageInfo.fsSizes.map((fs: any) => `  - ${fs.fs}: ${fs.size / (1024 ** 3)} GB, Available: ${fs.available / (1024 ** 3)} GB`).join('\n')}

## Network Info
- Interfaces:
${networkInfo.networkInterfaces.map((ni: any) => `  - ${ni.iface}: ${ni.ip4} (${ni.speed} Mbps)`).join('\n')}
- Network Stats:
${networkInfo.networkStats.map((ns: any) => `  - ${ns.iface}: RX ${ns.rx_bytes} bytes, TX ${ns.tx_bytes} bytes`).join('\n')}

## Benchmark Results
- CPU Score: ${benchmark.cpuScore.toFixed(2)}
- RAM Score: ${benchmark.ramScore.toFixed(2)}
- GPU Score: ${benchmark.gpuScore.toFixed(2)}
- Storage Score: ${benchmark.storageScore.toFixed(2)}
- Network Score: ${benchmark.networkScore.toFixed(2)}

## Comparison with Expected
${comparison}
        `;

        // Save markdown report to disk
        fs.writeFileSync('./host-status.md', markdownReport);
    }

    public get Report(): any {
        return this.report;
    }
}

// Uso de la clase HostMonitor
(async () => {
    const expectedBenchmark: ExpectedBenchmark = { cpuScore: 50, ramScore: 50, gpuScore: 50, storageScore: 50, networkScore: 50 };
    const monitor = new HostMonitor();
    await monitor.generateReport(expectedBenchmark);
    console.log(monitor.Report);
})();
*/