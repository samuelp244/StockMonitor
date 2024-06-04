"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UsersList } from "@/types/custom.types";

interface DataTableRowActionsProps<TData> {
  row: Row<UsersList>;
  handleDisableUser: ({
    userId,
    name,
  }: {
    userId: string;
    name: {
      first: string;
      last: string;
    };
  }) => Promise<void>;
  handleEnableUser: ({
    userId,
    name,
  }: {
    userId: string;
    name: {
      first: string;
      last: string;
    };
  }) => Promise<void>;
}

export function TableActionsForAdmin<TData>({
  row,
  handleDisableUser,
  handleEnableUser,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            const { userId, name } = row.original;
            if (row.original?.status === "ACTIVE") {
              void handleDisableUser({ userId, name });
            }else{
              void handleEnableUser({ userId, name });
            }
          }}
        >
          {row.original?.status === "ACTIVE" ? "disable" : "enable"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
