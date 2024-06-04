import { Types } from 'mongoose';

type Session = {
  key: string;
  exp: number;
  createdOn: Date;
  refreshTokenAs: string;
};

type LoginAttemptMeta = {
  attemptCount: number;
  blocked: boolean;
  lastAttemptTimer?: Date;
  lastBlockedTimer?: Date;
};

type Passwords = {
  current: string;
  old1?: string;
  old2?: string;
};

export type Auth = {
  sessions: Session[];
  loginAttemptMeta: LoginAttemptMeta;
  passwords: Passwords;
};

export type Name = {
  first: string;
  middle: string;
  last: string;
};

export interface SessionPayload {
  userId: Types.ObjectId;
  email: string;
  status: 'ACTIVE' | 'DISABLED';
  role: 'admin' | 'user';
  exp?: number;
  aud?: string;
  type?: 'access' | 'refresh';
}
