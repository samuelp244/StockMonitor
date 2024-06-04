import axiosInstance from "@/api/axiosInstance";
import Navbar from "@/components/common/Navbar";
import UserSubscriptionsList from "@/components/stocks/Dashboard";
import Overview from "@/components/stocks/Overview";
import { Button } from "@/components/ui/button";
import { CompanyInfoType } from "@/types/custom.types";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function IndividualSymbol() {
  const router = useRouter();
  const { symbol } = router.query;
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoType>();
  const fetchCompanyInfo = async () => {
    try {
      const response = await axiosInstance.get(
        `/stocks/companyDetails/${symbol}`
      );
      if (response.data.success) {
        setCompanyInfo(response.data?.companyInfo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    void fetchCompanyInfo();
  }, [symbol]);

  return (
    <main className='flex justify-center items-center min-h-screen'>
      <div className='rounded-lg border bg-background shadow-md w-full max-w-[90vw] h-[95vh] overflow-auto'>
        <div className='h-full flex-1 flex-col space-y-8 p-8 md:flex'>
          <div className='flex items-center justify-between space-y-2 '>
            <div className="flex gap-4">
              <div className='flex  space-x-2'>
                <Button
                  variant='outline'
                  className='h-8 w-8 p-0'
                  onClick={() => router.push("/dashboard")}
                >
                  <ChevronLeftIcon className='h-4 w-4' />
                </Button>
              </div>
              <div className='flex flex-col w-2/3 gap-1'>
                <h2 className='text-2xl font-bold tracking-tight'>
                  {companyInfo?.symbol} - {companyInfo?.companyName}
                </h2>
                <p className='text-muted-foreground'>
                  {companyInfo?.companyDescription}
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <Navbar />
            </div>
          </div>
          {companyInfo && symbol && (
            <Overview companyInfo={companyInfo} symbol={symbol as string} />
          )}
        </div>{" "}
      </div>
    </main>
  );
}
