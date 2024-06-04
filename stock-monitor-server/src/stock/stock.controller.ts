import {
  Controller,
  Get,
  Req,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard';
// import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@UseGuards(JwtAuthGuard)
@Controller('stocks')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get(':keyword')
  stockSearch(@Req() request: Request) {
    const { keyword } = request.params;
    return this.stockService.stockSearch(keyword);
  }

  // @UseInterceptors(CacheInterceptor)
  // @CacheKey('SYM')
  // @CacheTTL(1000 * 60)
  @Get('companyDetails/:symbol')
  stockCompanyInfo(@Req() request: Request) {
    const { symbol } = request.params;
    return this.stockService.fetchStockCompanyInfo({ symbol });
  }

  @Get('timeSeries/:symbol/:range')
  stockTimeSeriesInfo(@Req() request: Request) {
    const { symbol, range } = request.params;
    return this.stockService.fetchStockTimeSeries({ symbol, range });
  }
}
