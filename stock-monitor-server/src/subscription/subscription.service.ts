import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from 'src/schemas/Subscription.schema';
import { SubscriptionDto } from './dto/subscription.dto';
import { User } from 'src/schemas/User.schema';

@Injectable({})
export class SubscriptionService {
  constructor(
    @InjectModel('subscriptions')
    private subscriptionModel: Model<Subscription>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async subscribe(dto: SubscriptionDto) {
    try {
      const { userId, subscription } = dto;
      const userData = await this.userModel.findById(userId);
      if (!userData) {
        return new HttpException(
          { message: 'User does not exist', code: 'SUB-S-1' },
          HttpStatus.CONFLICT,
        );
      }
      const existingSubscription = await this.subscriptionModel.findOne({
        userId,
      });

      if (!existingSubscription) {
        const newSubscription = new this.subscriptionModel({
          userId,
          subscriptions: [subscription],
        });
        await newSubscription.save();
        return {
          message: `successfully subscribed to ${subscription.symbol}`,
          success: true,
        };
      } else {
        const existingSymbol = existingSubscription.subscriptions.find(
          (sub) => sub.symbol === subscription.symbol,
        );

        if (existingSymbol) {
          return new HttpException(
            {
              message: 'Subscription already exists for this symbol',
              code: 'SUB-S-2',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        existingSubscription.subscriptions.push(subscription);
        await existingSubscription.save();
        return {
          message: `successfully subscribed to ${subscription.symbol}`,
          success: true,
        };
      }
    } catch (error) {
      return new HttpException(
        { message: 'Internal server error', code: 'UNCAUGHT-SUB-S' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async unSubscribe(dto: SubscriptionDto) {
    try {
      const { userId, subscription } = dto;
      const userData = await this.userModel.findById(userId);
      if (!userData) {
        return new HttpException(
          { message: 'User does not exist', code: 'SUB-UN-2' },
          HttpStatus.CONFLICT,
        );
      }

      const existingSubscription = await this.subscriptionModel.findOne({
        userId,
      });

      if (!existingSubscription) {
        return new HttpException(
          {
            message: 'User has no subscriptions to unsubscribe from',
            code: 'SUB-UN-3',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const existingSymbolIndex = existingSubscription.subscriptions.findIndex(
        (sub) => sub.symbol === subscription.symbol,
      );

      if (existingSymbolIndex === -1) {
        return new HttpException(
          {
            message: 'Subscription does not exist for this symbol',
            code: 'SUB-UN-4',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Remove the subscription from the array
      existingSubscription.subscriptions.splice(existingSymbolIndex, 1);

      // Check if any subscriptions remain before saving
      if (existingSubscription.subscriptions.length === 0) {
        // No subscriptions left, delete the document
        await existingSubscription.deleteOne();
        return {
          message: `Successfully unsubscribed from all subscriptions`,
          success: true,
        };
      } else {
        // Update existing subscription with modified subscriptions array
        await existingSubscription.save();
        return {
          message: `Successfully unsubscribed from ${subscription.symbol}`,
          success: true,
        };
      }
    } catch (error) {
      return new HttpException(
        { message: 'Internal server error', code: 'UNCAUGHT-SUB-UN' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async listSubscriptions(userId: string) {
    try {
      const userData = await this.userModel.findById(userId);
      if (!userData) {
        return new HttpException(
          { message: 'User does not exist', code: 'SUB-L-1' },
          HttpStatus.CONFLICT,
        );
      }
      const userSubscriptions = await this.subscriptionModel.findOne({
        userId,
      });
      if (!userSubscriptions.subscriptions.length) {
        return [];
      }
      return {
        message: 'successfully fetched user subscriptions',
        success: true,
        subscriptions: userSubscriptions.subscriptions,
      };
    } catch (error) {
      return new HttpException(
        { message: 'Internal server error', code: 'UNCAUGHT-SUB-L' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
