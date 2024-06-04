import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    first: String,
    middle: String,
    last: String,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'DISABLED'],
    optional: true,
    default: 'ACTIVE',
  },
  auth: {
    sessions: [
      {
        key: String,
        exp: Number,
        createdOn: Date,
        refreshTokenAs: String,
      },
    ],
    loginAttemptMeta: {
      attemptCount: Number,
      blocked: Boolean,
      lastAttemptTimer: Date,
      lastBlockedTimer: Date,
    },
    passwords: {
      current: String,
      old1: String,
      old2: String,
    },
  },
  role: {
    type: String,
    enum: ['admin', 'user'], // Define access levels
    optional: true,
    default: 'user', // Set default access level
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User {
  email: string;

  name?: {
    first?: string;
    middle?: string;
    last?: string;
  };

  status?: 'ACTIVE' | 'DISABLED';

  role: 'admin' | 'user';

  createdAt?: Date;
  auth: {
    passwords: {
      current: string;
      old1: string;
      old2: string;
    };
    sessions: {
      key: string;
      exp: number;
      createdOn: Date;
      refreshTokenAs: string;
    }[];
    loginAttemptMeta: {
      attemptCount: number;
      blocked: boolean;
      lastAttemptTimer?: Date;
      lastBlockedTimer?: Date;
    };
  };
}
