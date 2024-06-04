import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { useState } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKeyword?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchKeyword,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Search...'
          value={searchTerm}
          onChange={(event) => {
            const keyword = event.target.value;
            setSearchTerm(keyword);
            searchKeyword &&
              table.getColumn(searchKeyword)?.setFilterValue(keyword);
          }}
          className='h-8 w-[150px] lg:w-[250px]'
        />
      </div>
    </div>
  );
}
