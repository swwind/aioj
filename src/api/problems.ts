import { ProblemAbstract, ProblemDetail } from 'app/types';
import { APICore } from './utils';

export const createProblemAPI = (api: APICore) => {
  const { makeDELETERequest, makeGETRequest, makePUTRequest, makePOSTRequest, makeMultipartRequest } = api;

  return {
    getProblemList() {
      return makeGETRequest<{ problems: ProblemAbstract[] }>('/problems');
    },
    getProblemDetail(pid: number) {
      return makeGETRequest<{ problem: ProblemDetail }>(`/p/${pid}`);
    },
    modifyProblem(pid: number, title: string, content: string, hidden: boolean, paint: string, playerMin: number, playerMax: number) {
      return makePUTRequest<{ problem: ProblemDetail }>(`/p/${pid}`, {
        title,
        content,
        hidden,
        paint,
        playerMin,
        playerMax,
      });
    },
    deleteProblem(pid: number) {
      return makeDELETERequest(`/p/${pid}`);
    },
    createProblem(title: string) {
      return makePOSTRequest<{ pid: number }>('/p/new', {
        title,
      });
    },
    uploadProblemJudger(pid: number, file: File, callback: (e: any) => void) {
      const formdata = new FormData();
      formdata.append('file', file);
      return makeMultipartRequest<{ problem: ProblemDetail }>(`/p/${pid}/file`, formdata, callback, 'PUT');
    },
  };
};
