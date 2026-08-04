import { Button } from "@/components/ui/button";
import { UseFormReturn, useFormState } from "react-hook-form";
export default function SubmitButtonFormComponents({
  form,
}: {
  form: UseFormReturn<{
    use_name: string;
    use_password: string;
    use_email: string;
    use_confirm_password: string;
  }>;
}) {
  const { isSubmitting } = useFormState({ control: form.control });
  return (
    <Button
      type="submit"
      className="lg:bg-main-color md:bg-main-color bg-orange-400 text-white w-full py-6 rounded-xl font-extrabold"
      disabled={isSubmitting ? true : false}
    >
      {isSubmitting ? "Cadastrando..." : "Cadastrar"}
    </Button>
  );
}
