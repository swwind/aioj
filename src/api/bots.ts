import { BotDetail } from 'app/types';
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

    getBotDetail(bid: number) {
      return makeGETRequest<{ bot: BotDetail }>(`/b/${bid}`);
    },

    createNewBotFromCode(pid: number, name: string, description: string, src: string, type: string) {
      return makePOSTRequest<{ bid: number }>(`/b/${pid}`, {
        name, description,
        src, type,
      })
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
        name, description,
        src, type,
      })
    },

    updateBotFromFile(bid: number, name: string, description: string, file: File, onProgress: (e: any) => void) {
      const formdata = new FormData();
      formdata.append('name', name);
      formdata.append('description', description);
      formdata.append('file', file);
      return makeMultipartRequest<{ bot: BotDetail }>(`/b/${bid}`, formdata, onProgress, 'PUT');
    },
  };
};
