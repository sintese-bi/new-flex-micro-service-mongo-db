import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircleIcon } from "lucide-react";
export default function Message({
  messages,
  title,
}: {
  messages: {
    label: string;
    value: number;
  }[];
  title: string;
}) {
  return (
    <>
      <p className="font-bold text-xs px-4">{title.toUpperCase()}</p>
      <div className="flex flex-wrap gap-2 px-4">
        {messages.map((message, index) => (
          <Badge
            key={index}
            className="inline-flex items-center p-2 rounded-md space-x-2 min-h-[46px]"
          >
            <AlertCircleIcon size={18} />
            <p className="text-xs">{message.label}</p>
            <p className="text-xs">{message.value}</p>
          </Badge>
        ))}
      </div>
    </>
  );
}
