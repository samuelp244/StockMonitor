import { CompanyInfoType } from "@/types/custom.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { formatCurrency } from "@/utils/convertors.utils";

const CompanyInfoCard = ({ data }: { data: CompanyInfoType }) => {
  return (
    <div>
      <div className='grid gap-4 grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Basic Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <h3 className='text-sm text-muted-foreground'>Symbol</h3>
                <p className='text-base font-medium'>{data.symbol}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>Company Name</h3>
                <p className='text-base font-medium'>{data.companyName}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>Exchange</h3>
                <p className='text-base font-medium'>{data.exchange}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>Currency</h3>
                <p className='text-base font-medium'>{data.currency}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>Country</h3>
                <p className='text-base font-medium'>{data.country}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>Sector</h3>
                <p className='text-base font-medium'>{data.sector}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Financial Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <h3 className='text-sm text-muted-foreground'>Market Cap</h3>
                <p className='text-base font-medium'>
                  {data.currency === "USD" ? "$" : ""}{" "}
                  {formatCurrency(
                    data.marketCapitalization !== "None"
                      ? data.marketCapitalization
                      : 0
                  )}
                </p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>P/E Ratio</h3>
                <p className='text-base font-medium'>{data.peRatio}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>EPS</h3>
                <p className='text-base font-medium'>{data.eps}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Dividend Yield
                </h3>
                <p className='text-base font-medium'>{data.dividendYield}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Financial Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <h3 className='text-sm text-muted-foreground'>Profit Margin</h3>
                <p className='text-base font-medium'>{data.profitMargin}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Operating Margin (TTM)
                </h3>
                <p className='text-base font-medium'>
                  {data.operatingMarginTTM}
                </p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Return on Assets (TTM)
                </h3>
                <p className='text-base font-medium'>
                  {data.returnOnAssetsTTM}
                </p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Return on Equity (TTM)
                </h3>
                <p className='text-base font-medium'>
                  {data.returnOnEquityTTM}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Growth Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Earnings Growth (YoY)
                </h3>
                <p className='text-base font-medium'>
                  {data.quarterlyEarningsGrowthYOY}
                </p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Earnings Growth (YoY)
                </h3>
                <p className='text-base font-medium'>
                  {data.quarterlyEarningsGrowthYOY}
                </p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Revenue Growth (YoY)
                </h3>
                <p className='text-base font-medium'>
                  {data.quarterlyRevenueGrowthYOY}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Valuation Ratios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <h3 className='text-sm text-muted-foreground'>Trailing P/E</h3>
                <p className='text-base font-medium'>{data.trailingPE}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>Forward P/E</h3>
                <p className='text-base font-medium'>{data.forwardPE}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Price-to-Sales Ratio (TTM)
                </h3>
                <p className='text-base font-medium'>
                  {data.priceToSalesRatioTTM}
                </p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Price-to-Book Ratio
                </h3>
                <p className='text-base font-medium'>{data.priceToBookRatio}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>EV/Revenue</h3>
                <p className='text-base font-medium'>{data.evToRevenue}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>EV/EBITDA</h3>
                <p className='text-base font-medium'>{data.evToEBITDA}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Shareholder Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Dividend Per Share
                </h3>
                <p className='text-base font-medium'>{data.dividendPerShare}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>Dividend Date</h3>
                <p className='text-base font-medium'>{data.dividendDate}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Ex-Dividend Date
                </h3>
                <p className='text-base font-medium'>{data.exDividendDate}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>Beta</h3>
                <p className='text-base font-medium'>{data.beta}</p>
              </div>

              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Shares Outstanding
                </h3>
                <p className='text-base font-medium'>
                  {data.sharesOutstanding}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyInfoCard;
