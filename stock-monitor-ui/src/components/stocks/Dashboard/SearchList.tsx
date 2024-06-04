import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useAppSelector } from "@/redux/hooks";
import { getStockData } from "@/utils/getStocksList";
import { Subscription } from "@/types/custom.types";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/common/DataTable";

export type Stocks = {
  symbol: string;
  name: string;
};

const SearchList = ({
  fetchUserSubscriptions,
  subscriptions,
  setLoader,
}: {
  fetchUserSubscriptions: () => Promise<void>;
  subscriptions: Subscription[];
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [data, setData] = useState<Stocks[]>([]);
  const { toast } = useToast();
  const columns: ColumnDef<Stocks>[] = [
    {
      accessorKey: "symbol",
      header: () => <p className=''>Symbol</p>,
      cell: ({ row }) => (
        <div className='capitalize '>{row.getValue("symbol")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "name",
      cell: ({ row }) => (
        <div className='lowercase'>{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: " ",
      cell: ({ row }) => {
        const alreadySubscribed =
          subscriptions.filter((o) => o.name === row.original.name).length > 0;
        return (
          <Button
            onClick={() => {
              void handleSubscription(row.original);
            }}
            disabled={alreadySubscribed}
          >
            {alreadySubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        );
      },
    },
  ];
  const auth = useAppSelector((state) => state.auth);
  const handleSubscription = async (subscription: {
    symbol: string;
    name: string;
  }) => {
    // setLoader(true);
    try {
      const response = await axiosInstance.post("/subscriptions/add", {
        userId: auth.user.userId,
        subscription: {
          name: subscription.name,
          symbol: subscription.symbol,
        },
      });
      if (response.data.success) {
        toast({
          title: "Subscription Added",
          description: `You've successfully subscribed to ${subscription.symbol} (${subscription.name}).`,
        });
        await fetchUserSubscriptions();
        // setLoader(false);
      }
    } catch (error) {
      //   setLoader(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const parsedData = await getStockData();
        setData(parsedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DataTable
      columns={columns}
      data={data}
      enableSearch
      searchKeyword='name'
    />
  );
};

export default SearchList;
