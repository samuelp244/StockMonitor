import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from 'src/schemas/Subscription.schema';
import { User } from 'src/schemas/User.schema';
// import axios from 'axios';

@Injectable({})
export class AdminService {
  constructor(
    @InjectModel('subscriptions')
    private subscriptionModel: Model<Subscription>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async usersList(params: { role: 'user' | 'admin' }) {
    try {
      if (params.role !== 'admin') {
        return new HttpException(
          { message: 'User does not have access', code: 'ADMIN-UL-1' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const result = await this.userModel.aggregate([
        {
          $match: {
            role: 'user',
          },
        },
        {
          $lookup: {
            from: 'subscriptions',
            localField: '_id',
            foreignField: 'userId',
            as: 'userSubscriptions',
          },
        },
        {
          $project: {
            _id: 0,
            name: '$name',
            status: '$status',
            email: '$email',
            userId: '$_id',
            subscriptions: {
              $arrayElemAt: ['$userSubscriptions.subscriptions', 0],
            },
          },
        },
      ]);

      return {
        success: true,
        message: 'successfully fetched users data',
        usersList: result,
      };
    } catch (error) {
      return new HttpException(
        { message: 'Internal server error', code: 'UNCAUGHT-ADMIN-UL' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async disableUser(params: { role: 'user' | 'admin'; userToDisable: string }) {
    try {
      if (params.role !== 'admin') {
        return new HttpException(
          { message: 'User does not have access', code: 'ADMIN-DU-1' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const user = await this.userModel.findOne({
        _id: params.userToDisable,
        status: { $ne: 'DISABLED' },
      });

      if (!user) {
        return new HttpException(
          {
            message: 'User does not exist or is already disabled',
            code: 'ADMIN-DU-2',
          },
          HttpStatus.NOT_FOUND, // More specific status code
        );
      }

      await this.userModel.findOneAndUpdate(
        {
          _id: params.userToDisable,
        },
        { status: 'DISABLED' },
      );
      return {
        success: true,
        message: `successfully disabled ${user.name.first} ${user.name.last}`,
      };
    } catch (error) {
      return new HttpException(
        { message: 'Internal server error', code: 'UNCAUGHT-ADMIN-DU' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async enableUser(params: { role: 'user' | 'admin'; userToEnable: string }) {
    try {
      if (params.role !== 'admin') {
        return new HttpException(
          { message: 'User does not have access', code: 'ADMIN-EU-1' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const user = await this.userModel.findOne({
        _id: params.userToEnable,
        status: { $ne: 'ACTIVE' },
      });

      if (!user) {
        return new HttpException(
          {
            message: 'User does not exist or is already active',
            code: 'ADMIN-EU-2',
          },
          HttpStatus.NOT_FOUND, // More specific status code
        );
      }

      await this.userModel.findOneAndUpdate(
        {
          _id: params.userToEnable,
        },
        { status: 'ACTIVE' },
      );
      return {
        success: true,
        message: `successfully enabled ${user.name.first} ${user.name.last}`,
      };
    } catch (error) {
      return new HttpException(
        { message: 'Internal server error', code: 'UNCAUGHT-ADMIN-EU' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
