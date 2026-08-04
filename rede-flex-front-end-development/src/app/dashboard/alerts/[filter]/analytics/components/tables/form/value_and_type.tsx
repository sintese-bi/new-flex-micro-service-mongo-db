"use client";
import { Input } from "@/components/ui/input";
export default function ValueAndType({
  selectedVariableValue,
}: {
  selectedVariableValue: number;
}) {
  return (
    <>
      <Input
        type="number"
        name="margin_min_value"
        defaultValue={selectedVariableValue}
        className="w-24"
        step={0.01}
      />
    </>
  );
}
