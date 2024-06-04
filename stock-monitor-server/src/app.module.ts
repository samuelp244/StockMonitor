import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedService } from './shared/shared.service';
import { ConfigModule } from '@nestjs/config';
import { StockModule } from './stock/stock.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGO_DB_STRING),
    StockModule,
    SubscriptionModule,
    AdminModule,
  ],
  controllers: [],
  providers: [SharedService],
})
export class AppModule {}
