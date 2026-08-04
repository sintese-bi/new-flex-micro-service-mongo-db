"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LockIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { handlePasswordRecovery } from "./analytics/actions";
const formSchema = z.object({
  use_password: z
    .string()
    .min(4, {
      message: "Sua senha precisa ter pelo menos 4 caracteres.",
    })
    .max(20, {
      message: "Sua senha precisa ter no máximo 10 caracteres.",
    }),
});
export default function PasswordRecovery({
  searchParams,
}: {
  searchParams: { use_token: string; use_email: string };
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      use_password: "",
    },
  });
  function handlePasswordRecoveryResponse(succeed: boolean, message: string) {
    if (succeed) {
      toast({
        duration: 1000,
        variant: "default",
        title: "Recuperação de senha",
        description: message,
      });
      router.push("/login");
    } else {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Recuperação de senha",
        description: message,
      });
    }
  }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const use_password = values["use_password"]!;
    const { use_email, use_token } = searchParams;
    const { succeed, message } = await handlePasswordRecovery({
      use_email,
      use_token,
      use_password,
    });
    handlePasswordRecoveryResponse(succeed, message);
  }
  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full h-screen">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/logo.png"
          alt="redeflex_logo"
          width={120}
          height={120}
          priority={true}
          className="w-auto h-auto"
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:w-1/4 md:w-2/4 sm:w-2/4 w-4/5 px-6 py-6 rounded-md shadow-lg"
        >
          <div>
            <p className="text-xs font-bold opacity-30">
              Por favor, digite sua nova senha no campo abaixo, você pode mudar
              sua senha sempre que desejar.
            </p>
          </div>
          <Separator />
          <FormField
            control={form.control}
            name={"use_password"}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 lg:text-black md:text-black text-white">
                  <LockIcon />
                  Nova senha
                </FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage className="lg:text-sm md:text-sm text-xs" />
              </FormItem>
            )}
          />
          <Button type="submit">Confirmar</Button>
        </form>
      </Form>
    </div>
  );
}
