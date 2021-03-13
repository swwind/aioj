import { counter, extractRoundDetail, rounds } from '../db';
import { SERVER_ERROR } from '../errors';
import { RoundData } from '../types';
import { Result } from '../utils';

export async function startNewRound(pid: number, bids: number[]): Promise<Result<number, string>> {
  const counts = await counter.findOneAndUpdate({ }, { $inc: { maxrid: 1 } });
  if (!counts.value) {
    return Result.error(SERVER_ERROR);
  }
  await rounds.insertOne({ pid, bids, log: '', rid: counts.value.maxrid, status: 'pending' });
  return Result.ok(counts.value.maxrid);
}

export async function updateRoundState(rid: number, status: RoundData['status'], log: string) {
  await rounds.findOneAndUpdate({ rid }, { $set: { status, log } });
}

export async function getRoundDetail(rid: number) {
  const round = await rounds.findOne({ rid });
  return round && extractRoundDetail(round);
}
