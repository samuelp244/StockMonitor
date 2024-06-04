export interface CustomZodError {
  for: string | number | undefined;
  message: string;
}
export type Subscription = {
  symbol: string;
  name: string;
};

export interface UsersList {
  userId: string;
  name: {
    first: string;
    last: string;
  };
  status: "ACTIVE" | "DISABLED";
  email: string;
  subscriptions?: Subscription[];
}

export interface CompanyInfoType {
  // Basic Information
  symbol: string;
  companyName: string;
  companyDescription: string;
  exchange: string;
  currency: string;
  country: string;
  sector: string;
  industry: string;

  // Financial Data
  marketCapitalization: number | "None"; // Represent as a number (remove commas and convert to a number)
  peRatio: number;
  eps: number;
  dividendYield: string; // Can potentially be a number if a dividend is paid

  // Financial Performance
  profitMargin: number;
  operatingMarginTTM: number;
  returnOnAssetsTTM: number;
  returnOnEquityTTM: number;

  // Growth Indicators
  quarterlyEarningsGrowthYOY: number;
  quarterlyRevenueGrowthYOY: number;

  // Valuation Ratios
  trailingPE: number;
  forwardPE: number;
  priceToSalesRatioTTM: number;
  priceToBookRatio: number;
  evToRevenue: number;
  evToEBITDA: number;

  // Shareholder Information
  dividendPerShare: string; // Can potentially be a number if a dividend is paid
  dividendDate: string;
  exDividendDate: string;
  beta: number;
  sharesOutstanding: number; // Represent as a number (remove commas and convert to a number)
}

export interface FinancialChartDataType {
  data: string;
  open: string;
  high: string;
  low: string;
  close: string;
  adjustedClose: string;
  volume: string;
  dividendAmount: string;
}
