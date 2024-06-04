import * as mongoose from 'mongoose';

export const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  subscriptions: [
    {
      symbol: String,
      name: String,
    },
  ],
});

export interface Subscription {
  userId: mongoose.Schema.Types.ObjectId;
  subscriptions: { symbol: string; name: string }[];
}
