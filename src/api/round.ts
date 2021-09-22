import { RoundDetail } from '../../app/types';
import { APICore } from './utils';

export const createRoundAPI = (api: APICore) => {
  const { makeGETRequest, makePOSTRequest } = api;

  return {
    getRoundDetail(rid: number) {
      return makeGETRequest<{ round: RoundDetail }>(`/s/${rid}`);
    },

    createNewRound(pid: number, bids: number[]) {
      return makePOSTRequest<{ rid: number }>(`/s/new`, { pid, bids });
    },
  };
};
