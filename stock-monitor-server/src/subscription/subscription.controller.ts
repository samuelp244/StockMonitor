import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';
import { SubscriptionService } from './subscription.service';
import { SubscriptionDto } from './dto';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('add')
  subscribe(@Body() dto: SubscriptionDto) {
    return this.subscriptionService.subscribe(dto);
  }

  @Post('remove')
  unsubscribe(@Body() dto: SubscriptionDto) {
    return this.subscriptionService.unSubscribe(dto);
  }

  @Get('list/:userId')
  listSubscriptions(@Req() request: Request) {
    const { userId } = request.params;
    return this.subscriptionService.listSubscriptions(userId);
  }
}
