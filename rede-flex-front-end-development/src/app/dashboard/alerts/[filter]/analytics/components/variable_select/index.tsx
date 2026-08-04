"use client";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dispatch, SetStateAction, Suspense } from "react";
import { Button } from "@/components/ui/button";
import SelectedVariables from "./selected_variables";
type Checked = DropdownMenuCheckboxItemProps["checked"];
export default function VariableSelectComponents({
  marginGC,
  marginAL,
  marginTotal,
  volumeGC,
  volumeAL,
  volumeTotal,
  setMarginGC,
  setMarginAL,
  setMarginTotal,
  setVolumeGC,
  setVolumeAL,
  setVolumeTotal,
}: {
  marginGC: Checked;
  marginAL: Checked;
  marginTotal: Checked;
  volumeGC: Checked;
  volumeAL: Checked;
  volumeTotal: Checked;
  setMarginGC: Dispatch<SetStateAction<Checked>>;
  setMarginAL: Dispatch<SetStateAction<Checked>>;
  setMarginTotal: Dispatch<SetStateAction<Checked>>;
  setVolumeGC: Dispatch<SetStateAction<Checked>>;
  setVolumeAL: Dispatch<SetStateAction<Checked>>;
  setVolumeTotal: Dispatch<SetStateAction<Checked | undefined>>;
}) {
  return (
    <div className="flex flex-col gap-4 lg:w-1/3 w-full">
      <p className="w-full text-sm font-bold">
        Escolha as variáveis a serem monitoradas
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Variáveis</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Variáveis</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={marginGC}>
            Margem GC
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={marginAL}>
            Margem AL
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={marginTotal}>
            Margem Total
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={volumeGC}>
            Volume GC
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={volumeAL}>
            Volume AL
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={volumeTotal}
            onCheckedChange={setVolumeTotal}
          >
            Volume Total
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SelectedVariables
        variables={[
          { label: "marginGC", value: marginGC, setValue: setMarginGC },
          { label: "marginAL", value: marginAL, setValue: setMarginAL },
          {
            label: "marginTotal",
            value: marginTotal,
            setValue: setMarginTotal,
          },
          { label: "volumeGC", value: volumeGC, setValue: setVolumeGC },
          { label: "volumeAL", value: volumeAL, setValue: setVolumeAL },
          {
            label: "volumeTotal",
            value: volumeTotal,
            setValue: setVolumeTotal,
          },
        ]}
      />
    </div>
  );
}
