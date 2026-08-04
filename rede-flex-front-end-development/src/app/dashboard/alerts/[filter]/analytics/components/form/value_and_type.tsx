import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
export default async function ValueAndTypeComponentsAlerts() {
  return (
    <div className="w-full">
      <Input type="number" name="margin_min_value" defaultValue={0} />
      <Select name="margin_min_value_type">
        <SelectTrigger className="w-full mt-2">
          <SelectValue placeholder="Tipo do valor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="absolute">Absoluto</SelectItem>
          <SelectItem value="percentage">Percentual</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
