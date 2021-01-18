import { SERVER_ERROR } from 'app/errors';
import { ProblemAbstract, ProblemDetail } from 'app/types';
import { counter, extractProblemAbstract, extractProblemDetail, problems } from '../db';
import { Result } from '../utils';
import { createRegion } from './forum';

export async function getAllProblems(): Promise<ProblemAbstract[]> {
  const result = await problems.find({ hidden: false }).toArray();
  return result.map(extractProblemAbstract);
}

export async function getProblemAuthor(pid: number): Promise<string | undefined> {
  const result = await problems.findOne({ pid });
  return result?.author;
}

export async function getProblemDetail(pid: number): Promise<ProblemDetail | null> {
  const result = await problems.findOne({ pid });
  return result && extractProblemDetail(result);
}

export async function createNewProblem(username: string, title: string): Promise<Result<number, string>> {
  const counts = await counter.findOneAndUpdate({ }, { $inc: { maxpid: 1 } });
  if (!counts.value) {
    return Result.error(SERVER_ERROR);
  }
  const pid = counts.value.maxpid;

  const result = await problems.insertOne({
    title,
    content: 'Please output `A + B`.',
    author: username,
    pid,
    date: Date.now(),
    hidden: true,
    fid: '',
    paint: '',
    playerMin: 2,
    playerMax: 2,
  });
  if (!result.result.ok) {
    return Result.error(SERVER_ERROR);
  }

  const res = await createRegion(`p${pid}`, title, '', true);
  if (!res.ok) return Result.error(SERVER_ERROR);

  return Result.ok(pid);
}

export async function modifyProblem(pid: number, title: string, content: string, hidden: boolean, paint: string, playerMin: number, playerMax: number) {
  await problems.findOneAndUpdate({ pid }, {
    $set: {
      title,
      content,
      hidden,
      paint,
      playerMin,
      playerMax,
    },
  });
}

export async function modifyProblemFid(pid: number, fid: string) {
  await problems.findOneAndReplace({ pid }, { $set: { fid } });
}

export async function deleteProblem(pid: number) {
  await problems.deleteOne({ pid });
}
