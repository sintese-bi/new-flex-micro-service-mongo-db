import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
export default function OptionsFormComponents({
  form,
}: {
  form: UseFormReturn<{
    use_email: string;
    use_password: string;
    remember_me: boolean;
  }>;
}) {
  return (
    <div className="flex justify-between w-full">
      <div className="flex lg:text-slate-500 md:text-slate-500 text-slate-200">
        <FormField
          control={form.control}
          name={"remember_me"}
          render={({ field }) => (
            <FormItem className="flex flex-row justify-end items-end gap-2">
              <FormControl>
                <Checkbox
                  id="remember_me"
                  className="lg:border-main-color md:border-main-color border-white"
                  checked={field.value} // Usar o valor booleano
                  onCheckedChange={
                    (checked) => field.onChange(checked) // Atualiza o valor booleano
                  }
                />
              </FormControl>
              <FormLabel className="lg:text-black md:text-black text-white">
                Lembrar de mim
              </FormLabel>
              <FormMessage className="lg:text-sm md:text-sm text-xs" />
            </FormItem>
          )}
        />
      </div>
      <Link
        className="lg:text-sm md:text-sm text-xs font-medium lg:text-slate-500 md:text-slate-500 text-slate-200 underline"
        href={"/send_recovery_email"}
      >
        Esqueceu a senha?
      </Link>
    </div>
  );
}
