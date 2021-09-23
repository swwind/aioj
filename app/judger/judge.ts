import os from 'os';
import path from 'path';
import { exec } from 'child_process';
import { promises as fs } from 'fs';

/**
 * unzip an uploaded file to a directory
 * @param fid file id
 * @returns unzipped directory
 */
async function unzip(fid: string) {
  const zip = `uploads/${fid}`;
  const dirname = await fs.mkdtemp(path.join(os.tmpdir(), 'aioj'));
  return new Promise<string>((resolve, reject) => {
    exec(`unzip "${zip}" -d "${dirname}"`, (err) => {
      if (err) reject(err);
      else resolve(dirname);
    });
  });
};

interface ISettings {
  name: string,
  id: string,
  build: string,
  run: string,
  folder: string,
  basedir: string,
}

// @see <https://github.com/zwongeer/liujdg/tree/master/doc/run>
interface IJudgeConfig {
  players: ISettings[],
  judger: ISettings,
  config: {
    logdir: string,
    basedir: string,
    timeLimit: number,
    buildTimeLimit: number,
  }
}

interface IJudgeResult {
  success: boolean,
  error: string,
  result: {
    players: {
      name: string,
      id: string,
      scores: number,
      isWinner: boolean,
    }[],
    comments: string,
  },
  player_logs: string[],
  judger_log: string,
  random: Array<number>,
}

export async function judge(judger_fid: string, bot_fids: string[]): Promise<IJudgeResult> {
  const players_number = bot_fids.length;
  const judger_folder = await unzip(judger_fid);
  const bot_folders = await Promise.all(bot_fids.map(unzip));
  const logdir = await fs.mkdtemp(path.join(os.tmpdir(), 'aioj-log'));

  try {
    
    const judger_settings: ISettings = JSON.parse(await fs.readFile(path.join(judger_folder, 'settings.json'), 'utf-8'));
    judger_settings.name = 'judger';
    judger_settings.id = 'judger';
    judger_settings.folder = 'data';
    judger_settings.basedir = judger_folder;

    const bot_settings = await Promise.all(bot_folders.map(async (folder, index) => {
      const setting: ISettings = JSON.parse(await fs.readFile(path.join(folder, 'settings.json'), 'utf-8'))
      setting.name = `player ${index}`;
      setting.id = `player ${index}`;
      setting.folder = 'data';
      setting.basedir = folder;
      return setting;
    }));

    const config: IJudgeConfig = {
      players: bot_settings,
      judger: judger_settings,
      config: {
        logdir,
        basedir: '.',
        timeLimit: 5,
        buildTimeLimit: 20,
      }
    };

    await fs.writeFile(path.join(logdir, 'config.json'), JSON.stringify(config));

    await new Promise<void>((resolve, reject) => {
      exec(`liujdg.build ${path.join(logdir, 'config.json')}`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise<void>((resolve, reject) => {
      exec(`liujdg.run ${path.join(logdir, 'config.json')}`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const result: IJudgeResult['result'] = JSON.parse(await fs.readFile(path.join(logdir, 'result.json'), 'utf-8'));
    const judger_logs = (await fs.readFile(path.join(logdir, 'judger_log.txt'), 'utf-8')).split('\n');
    const player_logs = new Array(players_number + 1);
    for (let i = 0; i <= players_number; ++ i) {
      player_logs[i] = await fs.readFile(path.join(logdir, `${i}.txt`), 'utf-8');
    }
    const random = new Array(players_number + 1);
    random[0] = 0;
    for (let i = 0; i < players_number; ++ i) {
      const { player_realid, random_id } = JSON.parse(judger_logs[i]);
      random[player_realid] = random_id;
    }

    return {
      success: true,
      error: '',
      result,
      player_logs,
      judger_log: judger_logs.slice(players_number).join('\n'),
      random,
    }

  } catch (e) {

    return {
      success: false,
      error: e.toString(),
      result: {
        players: [],
        comments: '',
      },
      judger_log: '',
      player_logs: [],
      random: [],
    }

  } finally {
    await fs.rm(judger_folder, { recursive: true, force: true });
    for (const bot_folder of bot_folders) {
      await fs.rm(bot_folder, { recursive: true, force: true });
    }
    await fs.rm(logdir, { recursive: true, force: true });
  }
}
