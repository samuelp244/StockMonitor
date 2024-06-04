import { IsNotEmpty, IsString } from 'class-validator';

class Stock {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class SubscriptionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  subscription: Stock;
}

export class ListSubscriptionsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
