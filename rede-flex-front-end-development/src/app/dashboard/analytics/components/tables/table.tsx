"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Message from "../message";

interface DataTableProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  averageMeasure?: { label: string; value: number }[];
  messageTitle: string;
}

export function DataTable<TData, TValue>({
  title,
  columns,
  data,
  averageMeasure,
  messageTitle,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    User_id: false,
    stations: false,
    Posto_ibm: false,
    ibm: false,
    "Cod Produto": false,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Pesquisar..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <p className="text-sm font-bold ml-4 mt-4 mb-6">{title}</p>
        {averageMeasure ? (
          <div className="my-8 space-y-6">
            <Message messages={averageMeasure!} title={messageTitle} />
            <div>
              <div className="flex items-center gap-2 px-4">
                <div className="h-4 w-11 rounded-md bg-green-100 border-2"></div>
                <p className="text-sm">
                  {title.toLowerCase().includes("galonagem")
                    ? "Lucro Bruto, TMs e M/LT acima do definido"
                    : "Lucro Bruto e TMs acima do definido"}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4">
                <div className="h-4 w-11 rounded-md bg-yellow-100 border-2"></div>
                <p className="text-sm">Lucro Bruto acima do definido</p>
              </div>
              <div className="flex items-center gap-2 px-4">
                <div className="h-4 w-11 rounded-md bg-red-100 border-2"></div>
                <p className="text-sm">Lucro Bruto abaixo do definido</p>
              </div>
            </div>
          </div>
        ) : null}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={
                      row.original.Resultado !== undefined
                        ? row.original.Resultado == 0
                          ? "bg-green-100"
                          : row.original.Resultado == 1
                          ? "bg-yellow-100"
                          : "bg-red-100"
                        : "bg-white"
                    }
                  >
                    {row.getVisibleCells().map((cell: any) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
