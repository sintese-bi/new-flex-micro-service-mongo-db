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
    use_email: string;
    use_password: string;
    remember_me: boolean;
  }>;
}) {
  return (
    <>
      <FormField
        control={form.control}
        name={'use_email'}
        render={({ field }) => (
          <FormItem>
            <FormLabel className='lg:text-black md:text-black text-white'>
              {'Email'}
            </FormLabel>
            <FormControl>
              <Input placeholder={'example@gmail.com'} {...field} />
            </FormControl>
            <FormMessage className='lg:text-sm md:text-sm text-xs' />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'use_password'}
        render={({ field }) => (
          <FormItem>
            <FormLabel className='lg:text-black md:text-black text-white'>
              {'Senha'}
            </FormLabel>
            <FormControl>
              <Input placeholder={'********'} type="password" {...field} />
            </FormControl>
            <FormMessage className='lg:text-sm md:text-sm text-xs' />
          </FormItem>
        )}
      />
    </>
  );
}
