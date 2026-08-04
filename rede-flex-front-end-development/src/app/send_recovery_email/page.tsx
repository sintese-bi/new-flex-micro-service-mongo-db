"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MailIcon } from "lucide-react";
import Image from "next/image";
import { handleSendEmail } from "./analytics/actions";
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
const formSchema = z.object({
  use_email: z
    .string()
    .email({ message: "Por favor, insira um email válido" })
    .min(4, {
      message: "Seu email precisa ter pelo menos 12 caracteres.",
    })
    .max(30, {
      message: "Seu email precisa ter no máximo 30 caracteres.",
    }),
});
export default function SendRecoveryEmail() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      use_email: "",
    },
  });
  function handleSendEmailResponse(succeed: boolean, message: string) {
    if (succeed) {
      toast({
        duration: 1000,
        variant: "default",
        title: "Recuperação de senha",
        description: message,
      });
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
    const { succeed, message } = await handleSendEmail(values);
    handleSendEmailResponse(succeed, message);
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
              Por favor, digite um email que tenha acesso, para receber o link
              de recuperação de senha.
            </p>
          </div>
          <Separator />
          <FormField
            control={form.control}
            name={"use_email"}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 lg:text-black md:text-black text-white">
                  <MailIcon />
                  Email
                </FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
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
