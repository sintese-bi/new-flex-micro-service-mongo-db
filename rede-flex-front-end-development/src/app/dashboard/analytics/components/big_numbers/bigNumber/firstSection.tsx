import {
  ArrowDownIcon,
  ArrowUpIcon,
  FuelIcon,
  PercentIcon,
} from "lucide-react";
export function BigNumberFirstSection({
  value,
  label,
  third_value,
  eighth_label,
  eighth_value,
  tenth_value,
  ninth_label,
  ninth_value,
  unit_type,
}: {
  value: string;
  label: string;
  third_value: boolean;
  eighth_label: string;
  eighth_value: string;
  tenth_value: boolean;
  ninth_label: string;
  ninth_value: string;
  unit_type: "real" | "gallon" | "real_per_gallon" | "percentage";
}) {
  const valueStatusStyle = tenth_value ? "text-green-200" : "text-red-200";
  const percentageStatusStyle = tenth_value ? "text-green-200" : "text-red-200";
  const sectionContent = {
    real: () => (
      <div className="flex lg:flex-row md:flex-row flex-col justify-between lg:items-center md:items-center items-start lg:space-y-0 md:space-y-0 space-y-4 w-full">
        <div className="space-y-1">
          <p className="lg:text-md md:text-md text-sm font-extrabold text-slate-400">
            {label}
          </p>
          <div className="flex  items-center gap-1 text-white">
            <p className="flex font-bold text-slate-400">R$</p>
            <p
              className={`lg:text-md md:text-md sm:text-sm font-bold ${valueStatusStyle}`}
            >
              {value}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="lg:text-md md:text-md text-sm font-extrabold text-slate-400">
            {eighth_label}
          </p>
          {eighth_value ? (
            <div className="flex  items-center gap-1 text-white">
              <p className="flex font-bold text-slate-400">R$</p>
              <p className={`lg:text-md md:text-md sm:text-sm font-bold`}>
                {eighth_value}
              </p>
            </div>
          ) : null}
        </div>
        <div className="space-y-1">
          <p className="lg:text-md md:text-md text-sm font-extrabold text-slate-400">
            {ninth_label}
          </p>
          <p
            className={`flex items-center gap-2 lg:text-md md:text-md text-sm font-extrabold ${valueStatusStyle}`}
          >
            {ninth_value ? `${ninth_value}%` : ""}
            {ninth_value !== undefined ? (
              tenth_value ? (
                <ArrowUpIcon size={12} />
              ) : (
                <ArrowDownIcon size={12} />
              )
            ) : null}
          </p>
        </div>
      </div>
    ),
    gallon: () => (
      <div className="flex lg:flex-row md:flex-row flex-col justify-between lg:items-center md:items-center items-start lg:space-y-0 md:space-y-0 space-y-4 w-full">
        <div className="space-y-1">
          <p className="lg:text-md md:text-md text-sm font-extrabold text-slate-400">
            {label}
          </p>
          <div className="flex  items-center gap-1 text-white">
            <FuelIcon className="flex text-slate-400" size={18} />
            <p
              className={`lg:text-md md:text-md sm:text-sm font-bold ${valueStatusStyle}`}
            >
              {label.includes("Abastecimentos") ? value : value}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="lg:text-md md:text-md text-sm font-extrabold text-slate-400">
            {eighth_label}
          </p>
          {eighth_value ? (
            <div className="flex  items-center gap-1 text-white">
              <FuelIcon className="flex text-slate-400" size={18} />
              <p className={`lg:text-md md:text-md sm:text-sm font-bold`}>
                {label.includes("Abastecimentos") ? eighth_value : eighth_value}
              </p>
            </div>
          ) : null}
        </div>
        <div className="space-y-1">
          <p className="lg:text-md md:text-md text-sm font-extrabold text-slate-400">
            {ninth_label}
          </p>
          <p
            className={`flex items-center gap-2 lg:text-md md:text-md text-sm font-extrabold ${percentageStatusStyle}`}
          >
            {ninth_value ? `${ninth_value}%` : ""}
            {ninth_value !== undefined ? (
              tenth_value ? (
                <ArrowUpIcon size={12} />
              ) : (
                <ArrowDownIcon size={12} />
              )
            ) : null}
          </p>
        </div>
      </div>
    ),
    real_per_gallon: () => (
      <div className="flex lg:flex-row md:flex-row flex-col justify-between lg:items-center md:items-center items-start lg:space-y-0 md:space-y-0 space-y-4 w-full">
        <div className="space-y-1">
          <p className="lg:text-md md:text-md text-sm font-extrabold text-slate-400">
            {label}
          </p>
          <div className="flex  items-center gap-1 text-white">
            <p className="flex font-bold text-slate-400">R$/L</p>
            <p
              className={`lg:text-md md:text-md sm:text-sm font-bold ${valueStatusStyle}`}
            >
              {value}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="lg:text-md md:text-md text-sm font-extrabold text-slate-400">
            {eighth_label}
          </p>
          {eighth_value ? (
            <div className="flex  items-center gap-1 text-white">
              <p className="flex font-bold text-slate-400">R$/L</p>
              <p className={`lg:text-md md:text-md sm:text-sm font-bold`}>
                {eighth_value}
              </p>
            </div>
          ) : null}
        </div>
        <div className="space-y-1">
          <p className="lg:text-md md:text-md text-sm font-extrabold text-slate-400">
            {ninth_label}
          </p>
          <p
            className={`flex items-center gap-2 lg:text-md md:text-md text-sm font-extrabold ${percentageStatusStyle}`}
          >
            {ninth_value ? `${ninth_value}%` : ""}
            {ninth_value !== undefined ? (
              tenth_value ? (
                <ArrowUpIcon size={12} />
              ) : (
                <ArrowDownIcon size={12} />
              )
            ) : null}
          </p>
        </div>
      </div>
    ),
    percentage: () => (
      <div className="flex lg:flex-row md:flex-row flex-col justify-between lg:items-center md:items-center items-start lg:space-y-0 md:space-y-0 space-y-4 w-full">
        <div className="space-y-1">
          <p className="lg:text-md md:text-md text-sm font-extrabold text-slate-400">
            {label}
          </p>
          <div className="flex  items-center gap-1 text-white">
            <p
              className={`lg:text-md md:text-md sm:text-sm font-bold ${valueStatusStyle}`}
            >
              {value}
            </p>
            <PercentIcon className="flex text-slate-400" size={18} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="lg:text-md md:text-md text-sm font-extrabold text-slate-400">
            {eighth_label}
          </p>
          {eighth_value ? (
            <div className="flex  items-center gap-1 text-white">
              <p className={`lg:text-md md:text-md sm:text-sm font-bold`}>
                {eighth_value}
              </p>
              <PercentIcon className="flex text-slate-400" size={18} />
            </div>
          ) : null}
        </div>
        <div className="space-y-1">
          <p className="lg:text-md md:text-md text-sm font-extrabold text-slate-400">
            {ninth_label}
          </p>
          <p
            className={`flex items-center gap-2 lg:text-md md:text-md text-sm font-extrabold ${percentageStatusStyle}`}
          >
            {ninth_value ? `${ninth_value}%` : ""}
            {ninth_value !== undefined ? (
              tenth_value ? (
                <ArrowUpIcon size={12} />
              ) : (
                <ArrowDownIcon size={12} />
              )
            ) : null}
          </p>
        </div>
      </div>
    ),
  };
  return <>{sectionContent[unit_type]()}</>;
}
