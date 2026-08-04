import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { IRegionalsSectionsFields } from "../../fields/regional";
import { IStationsSectionsFields } from "../../fields/station";

interface ISection {
  section: IStationsSectionsFields[] | IRegionalsSectionsFields[];
  data: any;
  onInputChange: (key: string, value: string | number) => void;
}

function DesktopSection({ section, data, onInputChange }: ISection) {
  const sectionInputFields = section.filter((field) => field.isInputField);

  return sectionInputFields.map((fieldItem, index: number) => (
    <div key={index} className={`flex flex-col gap-4`}>
      <Label htmlFor={fieldItem.accessorKey}>{fieldItem.header}</Label>
      <Input
        name={fieldItem.accessorKey}
        value={data[fieldItem.accessorKey] || 0}
        onChange={(e) => onInputChange(fieldItem.accessorKey, e.target.value)}
        className="col-span-3"
        type="number"
        min="0"
        step="0.00001"
      />
    </div>
  ));
}

function MobileSection({ section, data, onInputChange }: ISection) {
  const sectionInputFields = section.filter((field) => field.isInputField);

  return (
    <div className="space-y-4 w-full">
      {sectionInputFields.map((fieldItem, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row sm:items-center sm:gap-4"
        >
          <Label
            htmlFor={fieldItem.accessorKey}
            className="sm:w-1/3 font-medium text-sm"
          >
            {fieldItem.header}
          </Label>
          <Input
            name={fieldItem.accessorKey}
            value={data[fieldItem.accessorKey] || 0}
            onChange={(e) =>
              onInputChange(fieldItem.accessorKey, e.target.value)
            }
            type="number"
            min="0"
            step="0.00001"
            className="sm:flex-1"
          />
        </div>
      ))}
    </div>
  );
}

export default function ResponsiveSection(props: ISection) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? (
    <MobileSection {...props} />
  ) : (
    <DesktopSection {...props} />
  );
}
