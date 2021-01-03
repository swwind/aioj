import path from 'path';
import { promises as fs } from 'fs';
import { spawnFromCode } from './spawner';

export type JudgerSettings = {
  players: number | number[];
  main: string;
  paint: string;
  human: boolean | string;
  time_limit: number;
  time_limit_human: number;
}

export type BotSettings = {
  main: string;
}

const checkPlayerNumber = (limit: number | number[], x: number) => {
  if (typeof limit === 'number') {
    return x === limit;
  }
  if (limit.length === 1) {
    return limit[0] <= x;
  }
  if (limit.length === 2) {
    return limit[0] <= x && x <= limit[1];
  }
  throw new Error('Players limit invalid');
}

export const run = (judgerpath: string, botspath: string[], log: (str: string) => void) => {
  return new Promise<void>(async (resolve) => {

    const settings = JSON.parse(await fs.readFile(path.join(judgerpath, 'settings.json'), 'utf-8')) as JudgerSettings;
    if (!checkPlayerNumber(settings.players, botspath.length)) {
      throw new Error('Players number out of limit');
    }

    const bots = await Promise.all(botspath.map(async (botdir, index) => {
      const settings = JSON.parse(await fs.readFile(path.join(botdir, 'settings.json'), 'utf-8')) as BotSettings;
      const bot = await spawnFromCode(botdir, settings.main, log);
      bot.send(String(index));
      log(`bot ${index} prepared`);
      return bot;
    }));

    const judger = await spawnFromCode(judgerpath, settings.main, log);
    log('judger prepared');

    const clear = async () => {
      judger.kill();
      bots.forEach((bot) => bot.kill());
      
      resolve();
    }
    
    const win = async (player: number) => {
      log(`bot ${player} wins!!`);
      await clear();
    }
    const draw = async () => {
      log('the game is draw!!');
      await clear();
    }
    
    log('game round start');

    while (true) {
      const msg = await judger.read();

      log(`judger > ${msg}`);
      
      if (msg.startsWith('continue ')) {
        const player = msg.slice(9);
        const bot = bots[Number(player)];
        bot.send(player);
        const reply = await bot.read();
        log(`bot ${player} > ${reply}`);
        judger.send(reply);
        bots.forEach((tb) => {
          if (tb !== bot) {
            tb.send(`${player} ${reply}`);
          }
        });
      } else if (msg.startsWith('win ')) {
        const player = msg.slice(4);
        await win(Number(player));
      } else if (msg.startsWith('draw')) {
        await draw();
      } else {
        // game status
        bots.forEach((bot) => {
          bot.send(msg);
        });
      }
      
    }
  });
};
