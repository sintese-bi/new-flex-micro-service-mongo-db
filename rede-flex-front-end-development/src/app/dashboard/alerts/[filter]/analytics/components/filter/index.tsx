import { Separator } from "@/components/ui/separator";
import Link from "next/link";
export default async function Filter({ filter }: { filter: string }) {
  const links = [
    {
      href: `/dashboard/alerts/station`,
      label: "Posto",
    },
  ];

  return (
    <div className="flex flex-col justify-start items-start gap-4 py-2 w-full">
      <div className="flex flex-row gap-4">
        {links.map(({ href, label }, index: number) => (
          <Link href={href} className={`text-center text-sm w-16`} key={index}>
            {label}
          </Link>
        ))}
      </div>
      <Separator className="relative w-full">
        <div
          className={`w-16 absolute h-0.5 bg-blue-400 transition-transform duration-300 translate-x-${
            filter == "station" ? "0" : "20"
          }`}
        ></div>
      </Separator>
    </div>
  );
}
