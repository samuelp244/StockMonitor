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
    MongooseModule.forRoot(
      'mongodb://root:pass@127.0.0.1:27017/stockMonitor?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',
    ),
    StockModule,
    SubscriptionModule,
    AdminModule,
  ],
  controllers: [],
  providers: [SharedService],
})
export class AppModule {}
