export type State = {
  authorized: boolean;
  username: string;
};

export type Tools = {
  end(status: number, error: string): void;
  end(status: number, data?: Object): void;
  verifyBody(keys: string[]): boolean;
}
