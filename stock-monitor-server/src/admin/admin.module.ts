import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionSchema } from 'src/schemas/Subscription.schema';
import { UserSchema } from 'src/schemas/User.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'subscriptions',
        schema: SubscriptionSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
})
export class AdminModule {}
