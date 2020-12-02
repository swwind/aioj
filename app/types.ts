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

export type ConfigData = {
  maxpid: number; // max problem id
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
}

export type CommentData = {
  pid: number;
  region: string;
} & CommentDetail;

export type ProblemDetail = {
  pid: number;
  title: string;
  author: string;
  content: string;
}

export type ProblemData = {
  judger: string;
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
} & FileDetail;
