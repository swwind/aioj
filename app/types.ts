export type State = {
  authorized: boolean;
  username: string;
  admin: boolean;
};

export type Tools = {
  end(status: number, error: string): void;
  end(status: number, data?: Object): void;
  verifyBody(keys: string[]): boolean;
}
