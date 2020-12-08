import { FileDetail } from 'app/types';
import { makeDELETERequest, makeGETRequest, makeMultipartRequest } from './utils';

export function uploadFile(file: File) {
  const formdata = new FormData();
  formdata.append('filename', file.name);
  formdata.append('file', file);

  return makeMultipartRequest<{ file: FileDetail }>('/upload', formdata);
}

export function getUserUploadedFiles(username: string) {
  return makeGETRequest<{ files: FileDetail[] }>(`/files/u/${username}`);
}

export function deleteFile(fid: string) {
  return makeDELETERequest(`/files/${fid}`);
}
