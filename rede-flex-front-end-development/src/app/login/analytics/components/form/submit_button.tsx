import { Button } from "@/components/ui/button";
import { UseFormReturn, useFormState } from "react-hook-form";
export default function SubmitButtonFormComponents({
  form,
  isRedirecting,
}: {
  form: UseFormReturn<{
    use_email: string;
    use_password: string;
    remember_me: boolean;
  }>;
  isRedirecting: boolean;
}) {
  const { isSubmitting } = useFormState({ control: form.control });
  return (
    <Button
      type="submit"
      className="lg:bg-main-color md:bg-main-color bg-orange-400 text-white w-full py-6 rounded-xl font-extrabold"
      disabled={(isSubmitting || isRedirecting) ? true : false}
    >
      {
        isRedirecting ? 'Redirecionando...'
        : (isSubmitting ? "Realizando login..." : "Login")
      }
    </Button>
  );
}
