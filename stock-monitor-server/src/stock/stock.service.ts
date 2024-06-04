import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { CompanyInfoResponse } from './stock.types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const financialRangeConfig = {
  DAILY: 'TIME_SERIES_DAILY',
  WEEKLY: 'TIME_SERIES_WEEKLY_ADJUSTED',
  MONTHLY: 'TIME_SERIES_MONTHLY_ADJUSTED',
};
const financialRangeKeyConfig = {
  // 'Weekly Adjusted Time Series'
  DAILY: 'Time Series (Daily)',
  WEEKLY: 'Weekly Adjusted Time Series',
  MONTHLY: 'Monthly Adjusted Time Series',
};
@Injectable({})
export class StockService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  async stockSearch(keyword: string) {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${process.env.ALPHA_ADVANTAGE_KEY}`,
      );
      if (response.status !== 200) {
        return new HttpException(
          { message: 'Error fetching searched data', code: 'STOCK-SS-1' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const mappedData = response?.data?.bestMatches?.map((o) => {
        return { symbol: o?.['1. symbol'], name: o?.['2. name'] };
      });
      return {
        message: 'successfully fetched searched data',
        success: true,
        mappedData,
      };
    } catch (error) {
      return new HttpException(
        { message: 'Internal server error', code: 'UNCAUGHT-STOCK-SS' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async fetchStockCompanyInfo({ symbol }: { symbol: string }) {
    try {
      const cacheKey = `company_info_${symbol}`;
      // Check if data exists in the cache for the symbol
      const cachedData = await this.cacheManager.store.get(cacheKey);
      if (cachedData) {
        return {
          success: true,
          message: 'successfully fetched company info----------',
          companyInfo: cachedData,
        };
      }
      const response: AxiosResponse<CompanyInfoResponse> = await axios.get(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.ALPHA_ADVANTAGE_KEY}`,
      );
      if (response.status !== 200) {
        return new HttpException(
          { message: 'Error fetching data', code: 'STOCK-FSCI-1' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const data = this.createTheCompanyAnalytics(response.data);
      await this.cacheManager.store.set(cacheKey, data, 86400000);
      return {
        success: true,
        message: 'successfully fetched company info---',
        companyInfo: data,
      };
    } catch (error) {
      return new HttpException(
        { message: 'Internal server error', code: 'UNCAUGHT-STOCK-FSCI' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async fetchStockTimeSeries({
    symbol,
    range,
  }: {
    symbol: string;
    range: string;
  }) {
    try {
      //
      if (!Object.keys(financialRangeConfig).includes(range)) {
        return new HttpException(
          {
            message: 'Select a range: DAILY, WEEKLY, or MONTHLY.',
            code: 'STOCK-FSTS-1',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const cacheKey = `stock_time_series_${symbol}_${range}`;

      const cachedData = await this.cacheManager.store.get(cacheKey);
      if (cachedData) {
        return {
          success: true,
          message: 'successfully fetched chart data',
          chart: cachedData,
        };
      }
      const result = await this.fetchRangeData({ symbol, range });
      await this.cacheManager.store.set(cacheKey, result, 86400000);
      return {
        success: true,
        message: 'successfully fetched chart data',
        chart: result,
      };
    } catch (error) {
      return new HttpException(
        { message: 'Internal server error', code: 'UNCAUGHT-STOCK-FSTS' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async fetchRangeData(params: { symbol: string; range: string }) {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=${financialRangeConfig[params.range]}&symbol=${params.symbol}&apikey==${process.env.ALPHA_ADVANTAGE_KEY}`,
      );
      if (response.status !== 200) {
        return new HttpException(
          { message: 'Error fetching searched data', code: 'STOCK-FRD-1' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (response.data.Information) {
        return new HttpException(
          { message: 'API token has reached daily limit', code: 'STOCK-FRD-1' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const tempSeries = response.data?.[financialRangeKeyConfig[params.range]];
      const series = Object.keys(tempSeries).map((key) => {
        return {
          date: key,
          open: tempSeries?.[key]?.['1. open'],
          high: tempSeries?.[key]?.['2. high'],
          low: tempSeries?.[key]?.['3. low'],
          close: tempSeries?.[key]?.['4. close'],
          adjustedClose: tempSeries?.[key]?.['5. adjusted close'],
          volume: tempSeries?.[key]?.['6. volume'],
          dividendAmount: tempSeries?.[key]?.['7. dividend amount'],
        };
      });
      const result = {
        lastRefreshed: response.data?.['Meta Data']?.['3. Last Refreshed'],
        symbol: response.data?.['Meta Data']?.['2. Symbol'],
        series,
      };
      return result;
    } catch (error) {
      return new HttpException(
        { message: 'Internal server error', code: 'UNCAUGHT-STOCK-FRD' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  private createTheCompanyAnalytics(response: CompanyInfoResponse) {
    try {
      const result = {
        // General Company Information
        symbol: response.Symbol,
        companyName: response.Name,
        companyDescription: response.Description,
        exchange: response.Exchange,
        currency: response.Currency,
        country: response.Country,
        sector: response.Sector,
        industry: response.Industry,

        // Financial Data
        marketCapitalization: response.MarketCapitalization,
        peRatio: response.PERatio,
        eps: response.EPS, // Earnings per Share
        dividendYield: response.DividendYield,

        // Financial Performance (assuming some data points are missing from the interface)
        profitMargin: response.ProfitMargin || null, // Handle potential missing data
        operatingMarginTTM: response.OperatingMarginTTM || null,
        returnOnAssetsTTM: response.ReturnOnAssetsTTM || null,
        returnOnEquityTTM: response.ReturnOnEquityTTM || null,

        // Growth Indicators
        quarterlyEarningsGrowthYOY: response.QuarterlyEarningsGrowthYOY,
        quarterlyRevenueGrowthYOY: response.QuarterlyRevenueGrowthYOY,

        // Valuation Ratios
        trailingPE: response.TrailingPE,
        forwardPE: response.ForwardPE,
        priceToSalesRatioTTM: response.PriceToSalesRatioTTM,
        priceToBookRatio: response.PriceToBookRatio,
        evToRevenue: response.EVToRevenue,
        evToEBITDA: response.EVToEBITDA,

        // Shareholder Information
        dividendPerShare: response.DividendPerShare,
        dividendDate: response.DividendDate,
        exDividendDate: response.ExDividendDate,
        beta: response.Beta,
        sharesOutstanding: response.SharesOutstanding,
      };
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
