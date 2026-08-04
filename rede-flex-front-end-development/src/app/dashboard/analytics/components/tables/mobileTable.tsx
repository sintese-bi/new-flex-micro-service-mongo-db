"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import Message from "../message";

interface SimpleColumn {
  key: string;
  label: string;
  type: string;
}

interface DataTableProps<TData> {
  title: string;
  data: TData[];
  fields: SimpleColumn[];
  filterKey: string;
  secondaryFilterKey?: string;
  thirdFilterKey?: string;
  averageMeasure?: { label: string; value: number }[];
  messageTitle: string;
}

export function MobileTable<TData extends Record<string, any>>({
  title,
  data,
  fields,
  filterKey,
  secondaryFilterKey,
  thirdFilterKey,
  averageMeasure,
  messageTitle,
}: DataTableProps<TData>) {
  const uniquePrimary = useMemo(
    () => [...new Set(data.map((item) => item[filterKey]))],
    [data, filterKey]
  );
  const [primaryFilter, setPrimaryFilter] = useState<string>(
    String(uniquePrimary[0])
  );

  const secondaryOptions = useMemo(() => {
    if (!secondaryFilterKey) return [];
    const filtered = data.filter((item) => item[filterKey] === primaryFilter);
    return [...new Set(filtered.map((item) => item[secondaryFilterKey]))];
  }, [data, filterKey, secondaryFilterKey, primaryFilter]);

  const [secondaryFilter, setSecondaryFilter] = useState<string>("all");

  const thirdFilterOptions = useMemo(() => {
    if (!secondaryFilterKey || !thirdFilterKey) return [];
    const filtered = data.filter(
      (item) =>
        item[filterKey] === primaryFilter &&
        (secondaryFilter === "all" ||
          item[secondaryFilterKey] === secondaryFilter)
    );
    return [...new Set(filtered.map((item) => item[thirdFilterKey]))];
  }, [
    data,
    filterKey,
    secondaryFilterKey,
    primaryFilter,
    secondaryFilter,
    thirdFilterKey,
  ]);

  const [thirdFilter, setThirdFilter] = useState<string>("all");

  const filteredData = useMemo(() => {
    let base = data.filter((item) => item[filterKey] === primaryFilter);

    if (secondaryFilterKey && secondaryFilter !== "all") {
      base = base.filter(
        (item) => item[secondaryFilterKey] === secondaryFilter
      );
    }

    if (thirdFilterKey && thirdFilter !== "all") {
      base = base.filter((item) => item[thirdFilterKey] === thirdFilter);
    }

    return base;
  }, [
    data,
    secondaryFilterKey,
    secondaryFilter,
    thirdFilterKey,
    thirdFilter,
    filterKey,
    primaryFilter,
  ]);

  const [page, setPage] = useState(0);
  // Jump-to-page input state
  const [jumpInput, setJumpInput] = useState<string>(String(1));

  const pageSize = 1;
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginated = filteredData.slice(page * pageSize, (page + 1) * pageSize);

  useEffect(() => {
    setPage(0);
    setJumpInput(String(1));
  }, [primaryFilter, secondaryFilter]);

  useEffect(() => {
    setJumpInput(String(page + 1));
  }, [page]);

  const formatValue = (type: string, value: any) => {
    if (type === "currency") {
      return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
    }
    if (type === "percent") {
      return `${Math.round(value)}%`;
    }
    if (type === "volume") {
      return `${Number(value).toFixed(2).replace(".", ",")} L`;
    }
    if (type === "mlt") {
      return `R$ ${Number(value).toFixed(4).replace(".", ",")}`;
    }
    if (type === "time") {
      return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date(value));
    }
    return String(value);
  };

  const handlePrimaryFilterChange = (value: string) => {
    setPrimaryFilter(value);
    setSecondaryFilter("all");
    setThirdFilter("all");
  };

  const handleSecondaryFilterChange = (value: string) => {
    setSecondaryFilter(value);
    setThirdFilter("all");
  };

  const primaryFilterLabel = fields.find((el) => el.key === filterKey)?.label;
  const secondaryFilterLabel = fields.find(
    (el) => el.key === secondaryFilterKey
  )?.label;

  const thirdFilterLabel = fields.find(
    (el) => el.key === thirdFilterKey
  )?.label;

  return (
    <div className="space-y-6">
      <div className="py-4 px-4 gap-2 flex flex-col">
        <p className="text-sm font-bold mb-2">{title}</p>
        <SelectGroup>
          <SelectLabel className="p-0 pb-3">{primaryFilterLabel}</SelectLabel>
          <Select
            value={primaryFilter}
            onValueChange={handlePrimaryFilterChange}
          >
            <SelectTrigger className="w-full z-50">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {uniquePrimary.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SelectGroup>

        {secondaryFilterKey && secondaryOptions.length > 0 && (
          <SelectGroup>
            <SelectLabel className="p-0 pb-3">
              {secondaryFilterLabel}
            </SelectLabel>
            <Select
              value={secondaryFilter}
              onValueChange={handleSecondaryFilterChange}
            >
              <SelectTrigger className="w-full z-50">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {secondaryOptions.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SelectGroup>
        )}

        {thirdFilterKey && thirdFilterOptions.length > 0 && (
          <SelectGroup>
            <SelectLabel className="p-0 pb-3">{thirdFilterLabel}</SelectLabel>
            <Select value={thirdFilter} onValueChange={setThirdFilter}>
              <SelectTrigger className="w-full z-50">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {thirdFilterOptions.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SelectGroup>
        )}
      </div>

      {averageMeasure && (
        <div className="space-y-6">
          <Message messages={averageMeasure} title={messageTitle} />
        </div>
      )}

      {filteredData.length > 0 ? (
        <>
          {paginated.map((item, index) => (
            <div
              key={index}
              className="rounded-md border overflow-hidden bg-white shadow-sm"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicador</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map(({ key, label, type }) => (
                    <TableRow
                      key={key}
                      className={
                        item.Resultado !== undefined
                          ? item.Resultado === 0
                            ? "bg-green-100"
                            : item.Resultado === 1
                            ? "bg-yellow-100"
                            : "bg-red-100"
                          : "bg-white"
                      }
                    >
                      <TableCell className="font-medium text-sm">
                        {label}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatValue(type, item[key])}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Anterior
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 2) {
                      pageNum = i;
                    } else if (page > totalPages - 3) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    if (pageNum >= 0 && pageNum < totalPages) {
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum + 1}
                        </Button>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                >
                  Próximo
                </Button>
              </div>

              {/* Jump to page input */}
              <div className="flex justify-center items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  Ir para página:
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  min="1"
                  max={totalPages}
                  value={jumpInput}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setJumpInput(e.target.value);
                    }
                  }}
                  onBlur={() => {
                    const num = Number.parseInt(jumpInput, 10);
                    if (!isNaN(num) && num >= 1 && num <= totalPages) {
                      setPage(num - 1);
                    } else {
                      setJumpInput(String(page + 1));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      (e.currentTarget as HTMLInputElement).blur();
                    }
                  }}
                  className="w-12 h-8 text-center border rounded-md"
                />
                <span className="text-xs text-muted-foreground">
                  de {totalPages}
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum dado encontrado para os filtros selecionados.
        </div>
      )}
    </div>
  );
}
