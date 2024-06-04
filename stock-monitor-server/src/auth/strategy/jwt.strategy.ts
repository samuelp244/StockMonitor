import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { SessionPayload } from '../auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.headers?.authorization?.split(' ')[1],
      ]),
      secretOrKey: process.env.ACCESS_JWT_SECRET,
    });
  }
  validate(payload: SessionPayload) {
    return payload;
  }
}
