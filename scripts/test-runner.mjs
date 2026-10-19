import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import { run } from 'node:test';
import { spec } from 'node:test/reporters';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDir = path.resolve(__dirname, '../src/__tests__');
const tempDir = path.resolve(__dirname, '../dist-tests');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

console.log('⚡ ToolVa Unit Test Runner');
console.log('Transforming TypeScript tests with esbuild...');

const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('.test.ts'));
const bundleEntries = testFiles.map(f => path.join(testDir, f));

await esbuild.build({
  entryPoints: bundleEntries,
  outdir: tempDir,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  external: ['node:test', 'node:assert'],
});

const builtTestFiles = testFiles.map(f => path.join(tempDir, f.replace(/\.ts$/, '.js')));

console.log(`Running ${builtTestFiles.length} test suites with node:test...\n`);

const testStream = run({
  files: builtTestFiles,
});

testStream.compose(new spec()).pipe(process.stdout);

testStream.on('test:fail', () => {
  process.exitCode = 1;
});
