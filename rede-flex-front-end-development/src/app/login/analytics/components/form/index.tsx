import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import FieldsFormComponents from "./fields";
import SubmitButtonFormComponents from "./submit_button";
import OptionsFormComponents from "./options";
import { handleLogin } from "../../actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  use_password: z
    .string()
    .min(4, {
      message: "Sua senha precisa ter pelo menos 4 caracteres.",
    })
    .max(20, {
      message: "Sua senha precisa ter no máximo 10 caracteres.",
    }),
  remember_me: z.boolean(),
});
export default function FormComponents() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      use_email: "",
      use_password: "",
      remember_me: false,
    },
  });
  const [isRedirecting, setIsRedirecting] = useState(false);
  function handleLoginResponse(succeed: boolean, message: string) {
    if (succeed) {
      toast({
        duration: 1000,
        variant: "default",
        title: "Login",
        description: message,
      });
      router.push("/home");
      setIsRedirecting(true);
    } else {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Login",
        description: message,
      });
    }
  }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { access_token, succeed, message } = await handleLogin(values);
    localStorage.setItem("acess_token", access_token);
    handleLoginResponse(succeed, message);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-5/6 space-y-4">
        <FieldsFormComponents form={form} />
        <SubmitButtonFormComponents form={form} isRedirecting={isRedirecting} />
        <OptionsFormComponents form={form} />
      </form>
    </Form>
  );
}
