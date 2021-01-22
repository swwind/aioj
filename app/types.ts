export type State = {
  authorized: boolean;
  username: string;
  admin: boolean;
};

export type Tools = {
  end(status: number, error: string): void;
  end(status: number, data?: Object): void;
  verifyBody(keys: {
    [key: string]:
      'string' |
      'boolean' |
      'file' |
      'number' |
      Array<'string' | 'boolean' | 'file' | 'number'>
    }): boolean;
}

export type CounterData = {
  maxpid: number; // max problem id
  maxbid: number; // max bot id
  maxrid: number; // max round id
}

export type UserDetail = {
  username: string;
  description: string;
  email: string; // for gravatar
  admin: boolean;
}

export type UserData = {
  password: string;
  friends: string[];
} & UserDetail;

export type RegionDetail = {
  region: string;
  title: string;
  description: string;
}

export type RegionData = {
  maxpid: number; // for counting
  hidden: boolean;
} & RegionDetail;

export type PostDetail = {
  pid: number;
  title: string;
  author: string;
  date: number;
}

export type PostData = {
  region: string;
  maxcid: number; // for counting
} & PostDetail;

export type CommentDetail = {
  cid: number;
  author: string;
  edited: boolean;
  content: string;
  date: number;
  markdown: boolean;
}

export type CommentData = {
  pid: number;
  region: string;
} & CommentDetail;

export type ProblemAbstract = {
  pid: number;
  title: string;
}

export type ProblemDetail = {
  pid: number;
  title: string;
  author: string;
  content: string;
  date: number;
  hidden: boolean;
  fid: string;
  paint: string;
  playerMin: number;
  playerMax: number;
}

export type ProblemData = {
} & ProblemDetail;

export type FileDetail = {
  uploader: string;
  size: number;
  filename: string;
  fid: string;
  date: number;
}

export type FileData = {
  filepath: string;
  mimetype: string;
} & FileDetail;

export type AuthData = {
  username: string;
  token: string;
  date: number;
};

export type RoundDetail = {
  log: string;
  pid: number;
  bids: number[];
  rid: number;
  status: 'pending' | 'finish' | 'judging';
}

export type RoundData = {
} & RoundDetail;

export type BotDetail = {
  fid: string;
  version: number;
  name: string;
  description: string;
  author: string;
  pid: number;
  bid: number;
  created: number;
  updated: number;
}

export type BotData = {
} & BotDetail;
