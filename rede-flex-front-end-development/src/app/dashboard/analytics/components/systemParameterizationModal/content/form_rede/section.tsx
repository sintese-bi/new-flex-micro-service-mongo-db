import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface ISection {
  section: any;
  data: any;
  onInputChange: any;
}
export default function Section({ section, data, onInputChange }: ISection) {
  return section.map((fieldItem: any, index: number) => {
    return (
      <div key={index} className={`flex flex-col gap-4`}>
        <Label htmlFor={fieldItem.name}>{fieldItem.label}</Label>
        <Input
          name={fieldItem.name}
          value={data[fieldItem.name] || 0}
          onChange={(e) => onInputChange(fieldItem.name, e.target.value)}
          className="col-span-3"
          type="number"
          min="0"
          step="0.0001"
        />
      </div>
    );
  });
}
