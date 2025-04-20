import { PathLike } from 'fs';
import { access, mkdir as _mkdir } from 'fs/promises';
import { dirname, join } from 'path';

export function outPath(): string {
  return dirname(process.argv[1]);
}

export function rootPath(...paths: string[]): string {
  return join(outPath(), '..', '..', '..', ...paths); // yikes
}

export function localPath(...paths: string[]): string {
  return rootPath('local', ...paths);
}

export async function mkdir(path: PathLike) {
  try {
    await access(path);
  } catch {
    await _mkdir(path, {
      recursive: true,
    });
  }
}
