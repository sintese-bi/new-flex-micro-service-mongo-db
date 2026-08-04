"use client";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { CircleXIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
type Checked = DropdownMenuCheckboxItemProps["checked"];
export default function SelectedVariables({
  variables,
}: {
  variables: {
    label: string;
    value: string | boolean | undefined;
    setValue: Dispatch<SetStateAction<Checked>>;
  }[];
}) {
  const [selectedVariables, setSelectedVariables] = useState<
    {
      label: string;
      value: string | boolean | undefined;
      setValue: Dispatch<SetStateAction<Checked>>;
    }[]
  >([]);
  function handleDeselectItem(setValue: Dispatch<SetStateAction<Checked>>) {
    setValue(false);
  }
  useEffect(() => {
    setSelectedVariables(
      variables.filter((variable) => variable.value === true)
    );
  }, [variables]);
  return (
    <div className="w-full">
      {!selectedVariables.length ? (
        <p className="text-xs font-bold w-full text-slate-400 w-full">
          Por favor, escolha uma ou mais variáveis para serem monitoradas.
        </p>
      ) : (
        <div className="grid gap-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-2 grid-cols-2 justify-center items-center py-2 w-full">
          {selectedVariables.map((variable, index: number) => {
            return (
              <Badge
                key={index}
                variant="default"
                className="flex justify-center items-center bg-main-color py-2 cursor-pointer rounded-md gap-2"
                onClick={() => handleDeselectItem(variable.setValue)}
              >
                {variable.label}
                <CircleXIcon size={16} />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
