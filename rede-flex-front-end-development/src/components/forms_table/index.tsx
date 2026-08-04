import { useEffect, useState } from "react";
import { TransposedMobileTable } from "./mobile_table";
import { DataTable } from "./table";

interface FormsTableInterface {
  data: any;
  columns: any;
  visibility: any;
}

export default function FormsTable({
  data,
  columns,
  visibility,
}: FormsTableInterface) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col gap-12 pb-6">
      {isMobile ? (
        <TransposedMobileTable data={data} fields={columns} filterKey="name" />
      ) : (
        <DataTable columns={columns} data={data} visibility={visibility} />
      )}
    </div>
  );
}
