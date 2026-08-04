"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction } from "react";
export default function FuelOrProduct() {
  return (
    <RadioGroup
      defaultValue={"fuel"}
      className="flex items-center justify-center gap-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="fuel" id="fuel" />
        <Label htmlFor="fuel" className="text-sm">
          Combustível
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="lubricants" id="lubricants" />
        <Label htmlFor="lubricants" className="text-sm">
          Produto
        </Label>
      </div>
    </RadioGroup>
  );
}
