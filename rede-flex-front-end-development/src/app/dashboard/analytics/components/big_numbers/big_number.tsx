"use client";
import { BigNumbersInterfaces } from "../../interfaces/big_numbers";
import { BigNumberFirstSection } from "./bigNumber/firstSection";
import BigNumberSecondSection from "./bigNumber/secondSection";
import BigNumberThirdSection from "./bigNumber/thirdSection";

export default function DashboardComponentsBigNumber({
  data,
}: {
  data: BigNumbersInterfaces;
}) {
  return (
    <div className="flex flex-col justify-between h-full min-h-[162px] py-4 px-4 rounded-lg bg-main-color shadow-md gap-4">
      <div className="grid grid-cols-1 gap-4">
        <BigNumberFirstSection
          value={data.value}
          label={data.label}
          third_value={data.third_value}
          eighth_label={data.eighth_label}
          eighth_value={data.eighth_value}
          tenth_value={data.tenth_value}
          ninth_label={data.ninth_label}
          ninth_value={data.ninth_value}
          unit_type={data.unit_type}
        />
      </div>
      <div className="flex lg:flex-row md:flex-row flex-col justify-between gap-4 w-full">
        <BigNumberSecondSection
          secondary_label={data.secondary_label}
          secondary_value={data.secondary_value}
          fifth_label={data.fifth_label}
          fifth_value={data.fifth_value}
          fourth_label={data.fourth_label}
          fourth_value={data.fourth_value}
          third_value={data.third_value}
          unit_type={data.unit_type}
        />
        <BigNumberThirdSection
          fifth_label={data.fifth_label}
          fifth_value={data.fifth_value}
          sixth_value={data.sixth_value}
          seventh_label={data.seventh_label}
          seventh_value={data.seventh_value}
        />
      </div>
    </div>
  );
}
