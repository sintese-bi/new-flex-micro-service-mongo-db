import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="lg:bg-main-color md:bg-main-color bg-orange-400 text-white w-full py-6 font-extrabold w-[200px]"
      disabled={pending}
    >
      {pending ? "Atualizando..." : "Atualizar"}
    </Button>
  );
}
