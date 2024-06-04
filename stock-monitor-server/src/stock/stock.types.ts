export interface CompanyInfoResponse {
  // Basic information
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;

  // Identifiers and Exchange
  CIK: string;
  Exchange: string;
  Currency: string;

  // Location and Fiscal Period
  Country: string;
  Sector: string;
  Industry: string;
  Address: string;
  FiscalYearEnd: string;
  LatestQuarter: string;

  // Financial Data
  MarketCapitalization: number;
  EBITDA: number;
  PERatio: number;
  PEGRatio: number;
  BookValue: number;
  DividendPerShare: number;
  DividendYield: number;
  EPS: number;
  RevenuePerShareTTM: number;
  ProfitMargin: number;
  OperatingMarginTTM: number;
  ReturnOnAssetsTTM: number;
  ReturnOnEquityTTM: number;
  RevenueTTM: number;
  GrossProfitTTM: number;
  DilutedEPSTTM: number;

  // Growth data
  QuarterlyEarningsGrowthYOY: number;
  QuarterlyRevenueGrowthYOY: number;

  // Analyst Ratings
  AnalystTargetPrice: number;
  AnalystRatingStrongBuy: number;
  AnalystRatingBuy: number;
  AnalystRatingHold: number;
  AnalystRatingSell: number;
  AnalystRatingStrongSell: number;

  // Valuation Ratios
  TrailingPE: number;
  ForwardPE: number;
  PriceToSalesRatioTTM: number;
  PriceToBookRatio: number;
  EVToRevenue: number;
  EVToEBITDA: number;

  // Share Data
  Beta: number;
  '52WeekHigh': number;
  '52WeekLow': number;
  '50DayMovingAverage': number;
  '200DayMovingAverage': number;
  SharesOutstanding: number;

  // Dividend Information
  DividendDate: string;
  ExDividendDate: string;
}
