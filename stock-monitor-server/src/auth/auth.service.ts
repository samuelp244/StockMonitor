import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { LoginDto, SignupDto } from './dto';
import * as bcrypt from 'bcrypt';
import random from 'src/utils/random.utils';
import { SessionPayload } from './auth.types';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const ACCESS_TOKEN_EXPIRY_TIME = 60 * 60 * 24;
const REFRESH_TOKEN_EXPIRY_TIME = 60 * 60 * 24 * 7;

@Injectable({})
export class AuthService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async login(dto: LoginDto, response: Response) {
    try {
      const { email, password } = dto;
      const userData = await this.userModel.findOne({ email });
      if (!userData) {
        return new HttpException(
          { message: 'User does not exist', code: 'AUTH-L-1' },
          HttpStatus.CONFLICT,
        );
      }
      if (userData.status === 'DISABLED') {
        return new HttpException(
          { message: 'User is disabled', code: 'AUTH-L-2' },
          HttpStatus.CONFLICT,
        );
      }
      const isPasswordMatch = await bcrypt.compare(
        password,
        userData.auth.passwords.current,
      );
      if (!isPasswordMatch) {
        return new HttpException(
          { message: 'Incorrect Password', code: 'AUTH-L-3' },
          HttpStatus.CONFLICT,
        );
      }
      const payload = {
        userId: userData.id,
        email: userData.email,
        status: userData.status,
        role: userData.role,
      };
      const session = await this.createNewSession(payload, response);
      return session;
    } catch (error) {
      return new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signup(dto: SignupDto, response: Response) {
    try {
      const existingUser = await this.userModel.findOne({ email: dto.email });
      if (existingUser) {
        return new HttpException(
          { message: 'Email already exists', code: 'AUTH-S-1' },
          HttpStatus.CONFLICT,
        );
      }
      const userObject = await this.createInitialUserObject(dto);
      const newUser = new this.userModel(userObject);
      const savedUser = await newUser.save();
      const payload = {
        userId: savedUser.id,
        email: savedUser.email,
        status: savedUser.status,
        role: savedUser.role,
      };
      const session = await this.createNewSession(payload, response);
      return session;
    } catch (error) {
      return new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async renewAccess(req: Request, res: Response) {
    try {
      const authRefreshToken = req.cookies.stock_monitor_token;
      const refreshTokenPayload: any = jwt.verify(
        authRefreshToken,
        process.env.REFRESH_JWT_SECRET,
      );
      if (!refreshTokenPayload || refreshTokenPayload.type !== 'refresh') {
        const session = this.clearSession(res);
        return session;
      }
      const userData = await this.userModel.findById(
        refreshTokenPayload.userId,
      );
      if (!userData) {
        const session = this.clearSession(res);
        return session;
      }
      const payload = {
        userId: userData.id,
        email: userData.email,
        status: userData.status,
        role: userData.role,
      };
      const session = await this.createNewSession(payload, res);
      return session;
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async logout(req: Request, res: Response) {
    try {
      const authRefreshToken = req.cookies.stock_monitor_token;
      const refreshTokenPayload: any = jwt.verify(
        authRefreshToken,
        process.env.REFRESH_JWT_SECRET,
      );
      if (!refreshTokenPayload || refreshTokenPayload.type !== 'refresh') {
        const session = this.clearSession(res);
        return session;
      }

      const session = this.clearSession(res);
      await this.userModel.findByIdAndUpdate(refreshTokenPayload.userId, {
        $pull: {
          'auth.sessions': { key: refreshTokenPayload.key },
        },
      });
      return session;
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Private helper methods

  /**
   * Creates the initial user object with hashed password.
   * @param params SignupDto containing user information.
   * @throws HttpException for internal errors during user object creation.
   * @returns User object with hashed password.
   */
  private async createInitialUserObject(params: SignupDto) {
    try {
      const { name, email, password } = params;
      const passwordHash = await bcrypt.hash(password, 10);
      const userProfile: User = {
        name: {
          first: name.first ?? null,
          last: name.last ?? null,
        },
        email,
        status: 'ACTIVE',
        role: 'user',
        auth: {
          sessions: [],
          loginAttemptMeta: {
            attemptCount: 0,
            blocked: false,
            lastAttemptTimer: null,
            lastBlockedTimer: null,
          },
          passwords: {
            current: passwordHash,
            old1: null,
            old2: null,
          },
        },
      };
      return userProfile;
    } catch (error) {
      throw new HttpException('error creating the initial user object', 500, {
        cause: error,
      });
    }
  }

  /**
   * Creates a new session for a user and updates the user document.
   * @param payload SessionPayload containing user information.
   * @param res Express response object.
   * @throws HttpException for errors during session creation or saving.
   * @returns Login response object with access token and user information.
   */
  private async createNewSession(payload: SessionPayload, res: Response) {
    try {
      const refreshTokenKey = random.stringGenerator(10);
      const accessTokenExp =
        Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRY_TIME;
      const refreshTokenExp =
        Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRY_TIME;
      const sessionObject = {
        key: refreshTokenKey,
        exp: refreshTokenExp,
        createdOn: new Date(),
      };

      const updateUserSession = await this.userModel.findByIdAndUpdate(
        payload.userId,
        { $push: { 'auth.sessions': sessionObject } },
        { new: true },
      );
      if (!updateUserSession) {
        return new HttpException(
          'Failed to store session details',
          HttpStatus.CONFLICT,
        );
      }
      const refreshToken = jwt.sign(
        {
          exp: refreshTokenExp,
          aud: 'stock-monitor-ui',
          type: 'refresh',
          ...payload,
        },
        process.env.REFRESH_JWT_SECRET,
        {
          algorithm: 'HS256',
          issuer: 'stockMonitor.dev',
        },
      );
      const accessToken = jwt.sign(
        {
          exp: accessTokenExp,
          aud: 'stock-monitor-ui',
          type: 'access',
          ...payload,
        },
        process.env.ACCESS_JWT_SECRET,
        {
          algorithm: 'HS256',
          issuer: 'stockMonitor.dev',
        },
      );
      res.cookie(
        'stock_monitor_token', // Cookie name
        refreshToken,
        {
          path: '/',
          sameSite: false,
          httpOnly: true,
          secure: true,
          maxAge: REFRESH_TOKEN_EXPIRY_TIME * 1000,
        },
      );
      return res.send({
        success: true,
        message: 'Session created successfully',
        data: {
          accessToken,
          user: {
            name: updateUserSession.name,
            status: updateUserSession.status,
            role: updateUserSession.role,
            email: updateUserSession.email,
            userId: updateUserSession.id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Clears the user session by removing the refresh token cookie.
   * @param res Express response object.
   * @returns Logout response object with success message.
   */
  private async clearSession(res: Response) {
    try {
      res.cookie(
        'stock_monitor_token', // Cookie name
        null,
        {
          path: '/',
          sameSite: false,
          httpOnly: true,
          secure: true,
          maxAge: 0,
        },
      );
      return res.send({
        success: true,
        message: 'Successfully cleared user session',
      });
    } catch (error) {
      console.log(error);
    }
  }
}
