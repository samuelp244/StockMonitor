import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Subscription } from "@/types/custom.types";
import axiosInstance from "@/api/axiosInstance";
import { useAppSelector } from "@/redux/hooks";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { DataTable } from "@/components/common/DataTable";

const SubscriptionsList = ({
  data,
  fetchUserSubscriptions,
}: {
  data: Subscription[];
  fetchUserSubscriptions: () => Promise<void>;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const columns: ColumnDef<Subscription>[] = [
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
        return (
          <Button
            onClick={() => {
              router.push(`/dashboard/${row.original.symbol}`);
            }}
          >
            View
          </Button>
        );
      },
    },
    {
      accessorKey: " ",
      cell: ({ row }) => {
        return (
          <Button
            onClick={() => {
              void removeSubscription(row.original);
            }}
          >
            UnSubscribe
          </Button>
        );
      },
    },
  ];
  const auth = useAppSelector((state) => state.auth);
  const removeSubscription = async (subscription: {
    symbol: string;
    name: string;
  }) => {
    // setLoader(true);
    try {
      const response = await axiosInstance.post("/subscriptions/remove", {
        userId: auth.user.userId,
        subscription: {
          name: subscription.name,
          symbol: subscription.symbol,
        },
      });
      if (response.data.success) {
        toast({
          title: "Subscription Removed",
          description: `You've successfully unsubscribed from ${subscription.symbol} (${subscription.name}).`,
        });
        await fetchUserSubscriptions();
        // setLoader(false);
      }
    } catch (error) {
      //   setLoader(false);
    }
  };
  return (
    <DataTable
      columns={columns}
      data={data}
      heading='Subscriptions'
      searchKeyword='name'
    />
  );
};

export default SubscriptionsList;
