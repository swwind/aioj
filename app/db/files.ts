import { extractFileDetail, files } from '../db';
import { generateRandomBytes, Result } from '../utils';
import { promises as fs } from 'fs';
import { FILE_NOT_FOUND } from '../errors';
import { FileData, FileDetail } from 'app/types';

async function getNewFileId() {
  let fid = generateRandomBytes(16);
  while (await files.findOne({ fid })) {
    fid = generateRandomBytes(16);
  }
  return fid;
}

export async function saveFile(username: string, mimetype: string, filename: string, buffer: Buffer): Promise<Result<FileDetail, string>> {
  const fid = await getNewFileId();
  const filepath = `uploads/${fid}`;

  const filedata: FileData = {
    fid,
    uploader: username,
    size: buffer.length,
    filename,
    filepath,
    mimetype,
    date: Date.now(),
  };
  await files.insertOne(filedata);
  await fs.writeFile(filepath, buffer);

  return Result.ok(extractFileDetail(filedata));
}

export async function saveFileWithoutUser(buffer: Buffer) {
  const fid = await getNewFileId();
  const filepath = `uploads/${fid}`;
  await fs.writeFile(filepath, buffer);
  await files.insertOne({
    fid,
    uploader: '',
    size: buffer.length,
    filename: '',
    filepath,
    mimetype: '',
    date: Date.now(),
  });
  return fid;
}

export async function getFileData(fid: string): Promise<Result<FileData, string>> {
  const result = await files.findOne({ fid });
  if (!result) return Result.error(FILE_NOT_FOUND);
  return Result.ok(result);
}
export async function getFileDetail(fid: string): Promise<Result<FileDetail, string>> {
  const result = await files.findOne({ fid });
  if (!result) return Result.error(FILE_NOT_FOUND);
  return Result.ok(extractFileDetail(result));
}
export async function getFileDetailsByUsername(username: string): Promise<Result<FileDetail[], string>> {
  const result = await files.find({ uploader: username }).toArray();
  return Result.ok(result.map(extractFileDetail));
}

export async function deleteFile(fid: string): Promise<Result<void, string>> {
  const result = await files.findOne({ fid });
  if (!result) return Result.error(FILE_NOT_FOUND);
  try {
    await fs.access(result.filepath);
    await fs.unlink(result.filepath);
  } catch (e) {
    // eslint-disable-next-line
    console.log(`delete file ${fid} but it is not even exist.`);
  }
  await files.deleteOne(result);
  return Result.ok();
}
