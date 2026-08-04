import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
export default function FieldsFormComponents({
  form,
}: {
  form: UseFormReturn<{
    use_name: string;
    use_password: string;
    use_email: string;
    use_confirm_password: string;
  }>;
}) {
  const formFields: {
    name: "use_email" | "use_name" | "use_password" | "use_confirm_password";
    label: string;
    placeholder: string;
  }[] = [
    {
      name: "use_email",
      label: "Email",
      placeholder: "example@gmail.com",
    },
    { name: "use_name", label: "Nome de usuário", placeholder: "redeflex" },
    { name: "use_password", label: "Senha", placeholder: "********" },
    {
      name: "use_confirm_password",
      label: "Confirme sua senha",
      placeholder: "********",
    },
  ];
  return (
    <>
      {formFields.map((formField, index) => (
        <FormField
          key={index}
          control={form.control}
          name={formField.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex gap-4 lg:items-center md:items-center lg:text-black md:text-black text-white">
                {formField.label}
                <FormMessage className="text-xs font-bold lg:opacity-55 md:lg:opacity-55" />
              </FormLabel>
              <FormControl>
                <Input placeholder={formField.placeholder} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      ))}
    </>
  );
}
