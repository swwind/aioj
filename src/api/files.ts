import { FileDetail } from 'app/types';

import { APICore } from './utils';

export const createFilesAPI = (api: APICore) => {
  const { makeDELETERequest, makeGETRequest, makeMultipartRequest } = api;

  return {
    uploadFile(file: File, onProgress: (e: any) => void) {
      const formdata = new FormData();
      formdata.append('filename', file.name);
      formdata.append('file', file);
      return makeMultipartRequest<{ file: FileDetail }>('/upload', formdata, onProgress);
    },

    getUserUploadedFiles(username: string) {
      return makeGETRequest<{ files: FileDetail[] }>(`/files/u/${username}`);
    },

    deleteFile(fid: string) {
      return makeDELETERequest(`/files/${fid}`);
    },
  };
};
