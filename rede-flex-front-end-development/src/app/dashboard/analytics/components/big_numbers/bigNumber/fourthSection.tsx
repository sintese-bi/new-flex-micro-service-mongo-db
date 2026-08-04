import { ArrowUpCircleIcon, ArrowDownCircleIcon } from "lucide-react";
export default function BigNumberFourthSection({
  sixth_value,
}: {
  sixth_value: boolean;
}) {
  return sixth_value ? (
    <ArrowUpCircleIcon className={`text-green-200`} size={32} />
  ) : (
    <ArrowDownCircleIcon className={`text-red-200`} size={32} />
  );
}
