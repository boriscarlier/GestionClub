// Build-time only. Preserve classic-script scope and hoisting by reassembling
// these source units inside their ORIGINAL script tag, never as ES modules.
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(0, 'utf8');
new vm.Script(source); // Reject an invalid baseline before producing any units.
const candidates = [...source.matchAll(/^(?:async )?function\s+([A-Za-z_$][\w$]*)\s*\(/gm)];
let start = 0;
let name = 'initialization';
const parts = [];
for (const candidate of candidates) {
  const end = candidate.index;
  if (!source.slice(start, end).trim()) continue;
  try { new vm.Script(source.slice(start, end)); } catch { continue; }
  parts.push({name, start: Buffer.byteLength(source.slice(0,start)), end: Buffer.byteLength(source.slice(0,end))});
  start = end;
  name = candidate[1];
}
new vm.Script(source.slice(start));
parts.push({name, start: Buffer.byteLength(source.slice(0,start)), end: Buffer.byteLength(source)});
process.stdout.write(JSON.stringify(parts));
