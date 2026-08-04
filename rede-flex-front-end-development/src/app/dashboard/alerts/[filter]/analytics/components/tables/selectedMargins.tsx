import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function SelectedMargins({ variables }: { variables: any }) {
  const [selectedVariables, setSelectedVariables] = useState(
    Object.keys(variables).filter((variable) => variables[variable] !== 0)
  );
  return (
    <div className="flex gap-2 justify-center flex-wrap max-w-[400px]">
      {selectedVariables.map((selectedVariable, index) => (
        <Badge key={index}>{selectedVariable}</Badge>
      ))}
    </div>
  );
}
