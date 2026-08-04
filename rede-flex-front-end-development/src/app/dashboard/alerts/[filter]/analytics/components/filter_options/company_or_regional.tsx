"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
export default function CompanyOrRegional() {
  return (
    <RadioGroup
      defaultValue="company"
      className="flex items-center justify-center gap-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="company" id="company" />
        <Label htmlFor="company" className="text-sm">
          Posto
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="regional" id="network" />
        <Label htmlFor="regional" className="text-sm">
          Regional
        </Label>
      </div>
    </RadioGroup>
  );
}
