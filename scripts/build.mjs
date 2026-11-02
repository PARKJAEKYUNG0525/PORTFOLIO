// Node 24 + Windows에서 비ASCII 경로(예: "04. 공부")에 fs.rmSync를 호출하면 프로세스가
// 네이티브 크래시(0xC0000409)함. Vite는 빌드 전 outDir 비우기에 rmSync를 쓰므로,
// dist를 unlink/rmdir로 직접 비운 뒤 emptyOutDir: false로 빌드한다.
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'vite';

function clean(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.lstatSync(p).isDirectory()) {
      clean(p);
      fs.rmdirSync(p);
    } else {
      fs.unlinkSync(p);
    }
  }
}

clean(path.resolve('dist'));
await build({ build: { emptyOutDir: false } });
