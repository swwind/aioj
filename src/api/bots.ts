import { BotDetail } from 'app/types';
import { BotRecentRoundDetail } from '../../app/types';
import { APICore } from './utils';

export const createBotAPI = (api: APICore) => {
  const { makeGETRequest, makePUTRequest, makePOSTRequest, makeMultipartRequest } = api;

  return {
    getBotList(pid?: number, username?: string) {
      const url = new URLSearchParams();
      if (typeof pid !== 'undefined') url.append('p', String(pid));
      if (typeof username !== 'undefined') url.append('u', username);
      return makeGETRequest<{ bots: BotDetail[] }>(`/b/list?${url.toString()}`);
    },

    async getBotsDetail(bids: number[]) {
      const result = await makeGETRequest<{ bots: BotDetail[] }>(`/b/many?bids=${bids.join(',')}`);
      if (result.status === 200) {
        const map = new Map<number, BotDetail>();
        for (const bot of result.bots) {
          map.set(bot.bid, bot);
        }
        result.bots = bids.map((bid) => map.get(bid));
      }
      return result;
    },

    getBotDetail(bid: number) {
      return makeGETRequest<{ bot: BotDetail }>(`/b/${bid}`);
    },

    createNewBotFromCode(pid: number, name: string, description: string, src: string, type: string) {
      return makePOSTRequest<{ bid: number }>(`/b/${pid}`, {
        name,
        description,
        src,
        type,
      });
    },

    createNewBotFromFile(pid: number, name: string, description: string, file: File, onProgress: (e: any) => void) {
      const formdata = new FormData();
      formdata.append('name', name);
      formdata.append('description', description);
      formdata.append('file', file);
      return makeMultipartRequest<{ bid: number }>(`/b/${pid}`, formdata, onProgress);
    },

    updateBotFromCode(bid: number, name: string, description: string, src: string, type: string) {
      return makePUTRequest<{ bot: BotDetail }>(`/b/${bid}`, {
        name,
        description,
        src,
        type,
      });
    },

    updateBotInfomationsOnly(bid: number, name: string, description: string) {
      return makePUTRequest<{ bot: BotDetail }>(`/b/${bid}`, {
        name,
        description,
      });
    },

    updateBotFromFile(bid: number, name: string, description: string, file: File, onProgress: (e: any) => void) {
      const formdata = new FormData();
      formdata.append('name', name);
      formdata.append('description', description);
      formdata.append('file', file);
      return makeMultipartRequest<{ bot: BotDetail }>(`/b/${bid}`, formdata, onProgress, 'PUT');
    },

    getBotRecentRounds(bid: number) {
      return makeGETRequest<{ bot_rounds: BotRecentRoundDetail[] }>(`/b/recent/${bid}`);
    }
  };
};
