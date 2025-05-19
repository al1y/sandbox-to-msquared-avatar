import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Test various paths
const paths = [
  { name: 'Standard path', path: path.join(__dirname, 'data', 't-pose.json') },
  { name: 'Direct path', path: path.join(__dirname, 't-pose.json') },
  { name: 'Up one level', path: path.join(__dirname, '..', 'data', 't-pose.json') },
  { name: 'Public path', path: path.join(process.cwd(), '..', 'public', 'data', 't-pose.json') },
  { name: 'Project root', path: path.resolve(process.cwd(), 'data', 't-pose.json') }
];

// Check if each path exists
paths.forEach(p => {
  console.log(`${p.name} exists:`, fs.existsSync(p.path), p.path);
}); 