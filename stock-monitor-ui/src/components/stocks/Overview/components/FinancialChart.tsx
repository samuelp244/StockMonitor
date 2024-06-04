import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  DefaultTooltipContent,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { FinancialChartDataType } from "@/types/custom.types";
import axiosInstance from "@/api/axiosInstance";

const CustomTooltip = (props: any) => {
  if (props.payload[0] != null) {
    const newPayload = [
      {
        date: "date",
        value: props.payload[0].payload.date,
      },
      ...props.payload,
    ];

    return <DefaultTooltipContent {...props} payload={newPayload} />;
  }
  return <DefaultTooltipContent {...props} />;
};
const FinancialChart = ({ symbol }: { symbol: string }) => {
  // const data = dummySeries;
  const [data, setData] = useState<FinancialChartDataType[]>([]);
  const [range, setRange] = useState<"DAILY" | "WEEKLY" | "MONTHLY">("MONTHLY");
  const [lastRefreshed, setLastRefreshed] = useState("");
  const fetchFinancialChartData = async () => {
    try {
      const response = await axiosInstance.get(
        `/stocks/timeSeries/${symbol}/${range}`
      );
      if (response.data.success) {
        setData(response.data?.chart?.series?.slice().reverse());
        setLastRefreshed(response.data?.chart?.lastRefreshed);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    void fetchFinancialChartData();
  }, [symbol, range]);
  return (
    <div className='flex flex-col'>
      <h3 className='text-sm text-muted-foreground ml-4'>
        Last refreshed: {lastRefreshed}
      </h3>
      <div className='flex gap-4 flex-row-reverse w-full'>
        <Button
          variant={range === "DAILY" ? "default" : "outline"}
          onClick={() => setRange("DAILY")}
        >
          Daily
        </Button>
        <Button
          variant={range === "WEEKLY" ? "default" : "outline"}
          onClick={() => setRange("WEEKLY")}
        >
          Weekly
        </Button>
        <Button
          variant={range === "MONTHLY" ? "default" : "outline"}
          onClick={() => setRange("MONTHLY")}
        >
          Monthly
        </Button>
      </div>
      <ResponsiveContainer width='100%' height={350}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* <XAxis dataKey='data' /> */}
          <YAxis
            type='number'
            domain={[
              0,
              data?.length > 0
                ? Math.max(...data?.map((item) => parseFloat(item.close)))
                : 0,
            ]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type='monotone'
            dataKey='close'
            stroke='#8884d8'
            fillOpacity={1}
            fill='url(#colorUv)'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;
