import FormsTable from "@/components/forms_table";
export default function FormsTableConfiguration({
  data,
  fields,
}: {
  data: any;
  fields: any;
}) {
  const visibility: any = {};
  fields[0].concat(fields[1]).map((column: any) => {
    if (!column["isVisible"]) visibility[column["accessorKey"]] = false;
  });
  return <FormsTable data={data} columns={fields[0]} visibility={visibility} />;
}
