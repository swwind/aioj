import path from 'path';
import { spawn as childSpawn, exec as childExec } from 'child_process';
import createReader from './tools/readline';

export const exec = (command: string, log: (str: string) => void) => {
  log(`run $ ${command}`);
  return new Promise<string>((resolve, reject) => {
    childExec(command, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

export type JudgerProcess = {
  read(): Promise<string>;
  send(msg: string): void;
  kill(): void;
}

export const spawn = (command: string, args: string[], log: (str: string) => void): JudgerProcess => {
  log(`spawning $ ${command} ${args.join(' ')}`);
  const ps = childSpawn(command, args);

  return {
    read: createReader(ps.stdout),
    send(msg) {
      ps.stdin.write(msg + '\n');
    },
    kill() {
      ps.kill('SIGINT');
    }
  }
}

export const spawnFromCode = async (dirname: string, mainfile: string, log: (str: string) => void) => {
  if (mainfile.endsWith('.cpp')) {
    const output = path.join(dirname, mainfile.slice(0, -4));
    await exec(`g++ "${path.join(dirname, mainfile)}" -o "${output}"`, log);
    return spawn(output, [], log);
  } else if (mainfile.endsWith('.py')) {
    const file = path.join(dirname, mainfile);
    const python = (await exec('which python', log)).split('\n')[0];
    return spawn(python, [file], log);
  } else if (mainfile.endsWith('.js')) {
    const file = path.join(dirname, mainfile);
    const node = (await exec('which node', log)).split('\n')[0];
    return spawn(node, [file], log);
  } else if (mainfile.endsWith('.ts')) {
    const file = path.join(dirname, mainfile);
    const deno = (await exec('which deno', log)).split('\n')[0];
    return spawn(deno, [file], log);
  } else {
    throw new Error("unsupported file");
  }
}
