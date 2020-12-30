import { ProblemAbstract, ProblemDetail } from 'app/types';
import { APICore } from './utils';

export const createProblemAPI = (api: APICore) => {
  const { makeDELETERequest, makeGETRequest, makePUTRequest, makePOSTRequest } = api;

  return {
    getProblemList() {
      return makeGETRequest<{ problems: ProblemAbstract[] }>('/problems');
    },
    getProblemDetail(pid: number | string) {
      return makeGETRequest<{ problem: ProblemDetail }>(`/p/${pid}`);
    },
    modifyProblem(pid: number | string, title: string, content: string, hidden: boolean) {
      return makePUTRequest(`/p/${pid}`, {
        title,
        content,
        hidden,
      });
    },
    deleteProblem(pid: number | string) {
      return makeDELETERequest(`/p/${pid}`);
    },
    createProblem(title: string) {
      return makePOSTRequest<{ pid: number }>('/p/new', {
        title,
      });
    }
  };
};
