import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { CompanyInfoType } from "@/types/custom.types";
import CompanyInfoCard from "./components/FinancialInfoCard";
import FinancialChart from "./components/FinancialChart";

const Overview = ({
  symbol,
  companyInfo,
}: {
  symbol: string;
  companyInfo: CompanyInfoType;
}) => {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
      <Card className='col-span-7'>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className='pl-2'>
          <FinancialChart symbol={symbol} />
        </CardContent>
      </Card>
      <Card className='col-span-7'>
        <CardHeader>
          <CardTitle>Company Info</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyInfoCard data={companyInfo} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
