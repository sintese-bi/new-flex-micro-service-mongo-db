import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
export default async function DashboardComponentsFilter() {
  return (
    <div className="flex flex-col justify-start items-start gap-4 py-2">
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
          <RadioGroupItem value="network" id="network" />
          <Label htmlFor="network" className="text-sm">
            Rede
          </Label>
        </div>
      </RadioGroup>
      <Separator />
    </div>
  );
}
