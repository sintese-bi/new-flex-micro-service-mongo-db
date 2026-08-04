import { PercentIcon } from "lucide-react";
export default function BigNumberSecondSection({
  secondary_label,
  secondary_value,
  third_value,
  fifth_label,
  fifth_value,
  fourth_label,
  fourth_value,
  unit_type,
}: {
  secondary_label: string;
  secondary_value: string;
  third_value: boolean;
  fourth_label: string;
  fourth_value: string;
  fifth_value: string;
  fifth_label: string;
  unit_type: "real" | "gallon" | "real_per_gallon" | "percentage";
}) {
  const sectionContent = {
    real: () => <p></p>,
    gallon: () => <p></p>,
    real_per_gallon: () => <p></p>,
    percentage: () => <p></p>,
  };
  return (
    <div>
      <div className="flex gap-1">
        <p className="text-xs font-bold text-slate-400">{secondary_label}</p>
        {secondary_label?.includes("Lucro Bruto Operacional") ? (
          <>
            <div
              className={`flex items-center ${
                third_value ? "text-green-200" : "text-red-200"
              }`}
            >
              <p className="text-xs font-bold">
                {secondary_value != "0" ? secondary_value : ""}
              </p>
              <PercentIcon className="flex" size={14} />
            </div>
          </>
        ) : (
          <div>
            <p
              className={`text-xs font-bold ${
                third_value ? "text-green-200" : "text-red-200"
              }`}
            >
              {secondary_value != "0" ? secondary_value : ""}
            </p>
          </div>
        )}
      </div>
      <div>
        {third_value !== undefined ? (
          <div className="flex gap-1">
            <p className="text-xs font-bold text-slate-400">{fourth_label}</p>
            <p className={`text-xs font-bold text-white`}>
              {fourth_value != "0" ? fourth_value : ""}{" "}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
