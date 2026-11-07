import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const files = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? (e.name === '__tests__' ? [] : files(p)) : /\.tsx?$/.test(e.name) ? [p] : [];
  });

describe('effects', () => {
  // `useEffect(() => something())` returns whatever something() returns, and React
  // calls that as a cleanup. window.scrollTo returns a Promise in newer browsers,
  // which crashed every page change. Effects must use a block body (or return a function).
  it('never use an expression body that could return a non-function', () => {
    const offenders: string[] = [];
    for (const file of files(path.resolve(__dirname, '..'))) {
      const src = fs.readFileSync(file, 'utf8');
      for (const m of src.matchAll(/use(?:Layout)?Effect\(\(\) => (?!\{|\(\) =>)/g)) {
        const line = src.slice(0, m.index).split('\n').length;
        offenders.push(`${path.relative(process.cwd(), file)}:${line}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
