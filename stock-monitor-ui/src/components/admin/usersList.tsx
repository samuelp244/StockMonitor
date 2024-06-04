import { UsersList } from "@/types/custom.types";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Button } from "../ui/button";
import { DataTable } from "../common/DataTable";
import { TableActionsForAdmin } from "./components/TableActionsForAdmin";
import { useToast } from "../ui/use-toast";
import axiosInstance from "@/api/axiosInstance";

const UsersListComponent = ({
  data,
  fetchUserList,
}: {
  data: UsersList[];
  fetchUserList: () => Promise<void>;
}) => {
  const { toast } = useToast();
  const handleDisableUser = async ({
    userId,
    name,
  }: {
    userId: string;
    name: { first: string; last: string };
  }) => {
    try {
      const response = await axiosInstance.patch("/admin/users/disable", {
        userToDisable: userId,
      });
      if (response.data.success) {
        toast({
          title: "User Disabled",
          description: `${name.first} has been disabled successfully.`,
        });
        await fetchUserList();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEnableUser = async ({
    userId,
    name,
  }: {
    userId: string;
    name: { first: string; last: string };
  }) => {
    try {
      const response = await axiosInstance.patch("/admin/users/enable", {
        userToEnable: userId,
      });
      if (response.data.success) {
        toast({
          title: "User Enabled",
          description: `${name.first} has been enabled successfully.`,
        });
        await fetchUserList();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const columns: ColumnDef<UsersList>[] = [
    {
      accessorKey: "name",
      header: () => "Name",
      cell: ({ row }) => (
        <div className='capitalize '>{`${row.original.name.first} ${row.original.name.last}`}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className=''>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "subscriptions",
      header: "subscriptions",
      cell: ({ row }) => (
        <div className=''>
          {row.original?.subscriptions
            ? row.original?.subscriptions?.length
            : 0}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "status",
      cell: ({ row }) => <div className=''>{row.getValue("status")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <TableActionsForAdmin
          row={row}
          handleDisableUser={handleDisableUser}
          handleEnableUser={handleEnableUser}
        />
      ),
    },
  ];
  return (
    <DataTable
      columns={columns}
      data={data}
      enableSearch
      searchKeyword='email'
    />
  );
};

export default UsersListComponent;
