import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function RowFormField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: number;
}) {
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <Input
        name={name}
        defaultValue={defaultValue}
        className="col-span-3"
        type="number"
        min="0"
        step="0.0001"
      />
    </>
  );
}
