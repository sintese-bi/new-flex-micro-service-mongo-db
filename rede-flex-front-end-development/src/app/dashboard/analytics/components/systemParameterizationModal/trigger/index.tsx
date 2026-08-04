import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { BoltIcon } from "lucide-react";

export default function SystemParameterizationModalTrigger() {
  return (
    <DialogTrigger asChild>
      <Button className="flex gap-2">
        <BoltIcon size={18} />
        <p>Calibragem</p>
      </Button>
    </DialogTrigger>
  );
}
