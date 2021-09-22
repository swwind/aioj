import os from 'os';
import { exec } from 'child_process';
import { promises as fs } from 'fs';

/**
 * unzip an uploaded file to a directory
 * @param fid file id
 * @returns unzipped directory
 */
async function unzip(fid: string) {
  const zip = `uploads/${fid}`;
  const dirname = os.tmpdir();
  return new Promise<string>((resolve, reject) => {
    exec(`unzip "${zip}" -d "${dirname}"`, (err) => {
      if (err) reject(err);
      else resolve(dirname);
    });
  });
};

export async function judge(judger_fid: string, bot_fids: string[]) {
  const judger_folder = await unzip(judger_fid);
  const bot_folders = await Promise.all(bot_fids.map(unzip));

  try {
    // TODO
  } catch (e) {
    // TODO
  } finally {
    await fs.rm(judger_folder, { recursive: true, force: true });
    for (const bot_folder of bot_folders) {
      await fs.rm(bot_folder, { recursive: true, force: true });
    }
  }
}
