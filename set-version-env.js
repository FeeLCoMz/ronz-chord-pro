import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
const envPath = join(process.cwd(), '.env');

let envContent = '';
try {
  envContent = readFileSync(envPath, 'utf8');
} catch {
  envContent = '';
}

const versionLine = `VITE_APP_VERSION=${pkg.version}`;
const lines = envContent.split(/\r?\n/).filter(line => !line.startsWith('VITE_APP_VERSION='));
lines.push(versionLine);
writeFileSync(envPath, lines.join('\n') + '\n');
console.log('Set VITE_APP_VERSION to', pkg.version);
