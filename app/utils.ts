import crypto from 'crypto';

export class Result<T, R> {
  ok: boolean;
  data: T | R;

  private constructor(ok: boolean, t: T | R) {
    this.ok = ok;
    this.data = t;
  }

  static ok<T, R>(t?: T) {
    return new Result<T, R>(true, t as T);
  }

  static error<T, R>(r: R) {
    return new Result<T, R>(false, r);
  }

  result(): T {
    return this.data as T;
  }

  error(): R {
    return this.data as R;
  }
}

export const neq = <T> (x: T) => (y: T) => x !== y;
export const generateRandomBytes = (n: number) => {
  return crypto.randomBytes(n).toString('hex');
};

let locked = false;
const pendings: Function[] = [];
const updateQueue = () => {
  if (locked) {
    return;
  }
  const top = pendings.shift();
  if (!top) {
    return;
  }
  locked = true;
  top();
}

export const lock = () => {
  return new Promise((resolve) => {
    pendings.push(resolve);
    updateQueue();
  });
}

export const unlock = () => {
  locked = false;
  updateQueue();
}
