import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import FieldsFormComponents from "./fields";
import SubmitButtonFormComponents from "./submit_button";
import { handleRegister } from "../../actions";
const formSchema = z.object({
  use_email: z
    .string()
    .email({ message: "Por favor, insira um email válido" })
    .min(4, {
      message: "Seu username precisa ter pelo menos 4 caracteres.",
    })
    .max(30, {
      message: "Seu username precisa ter no máximo 30 caracteres.",
    }),
  use_name: z
    .string()
    .min(4, {
      message: "Seu username precisa ter pelo menos 4 caracteres.",
    })
    .max(26, {
      message: "Seu username precisa ter no máximo 26 caracteres.",
    }),
  use_password: z
    .string()
    .min(4, {
      message: "Sua senha precisa ter pelo menos 4 caracteres.",
    })
    .max(12, {
      message: "Sua senha precisa ter no máximo 12 caracteres.",
    }),
  use_confirm_password: z
    .string()
    .min(4, {
      message: "Sua senha precisa ter pelo menos 4 caracteres.",
    })
    .max(12, {
      message: "Sua senha precisa ter no máximo 12 caracteres.",
    }),
});
export default function FormComponents() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      use_email: "",
      use_name: "",
      use_password: "",
      use_confirm_password: "",
    },
  });
  function handleRegisterResponse(succeed: boolean, message: string) {
    if (succeed) {
      toast({
        duration: 1000,
        variant: "default",
        title: "Registro",
        description: message,
      });
      router.push("/login");
    } else {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Registro",
        description: message,
      });
    }
  }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { succeed, message } = await handleRegister(values);
    handleRegisterResponse(succeed, message);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-5/6 space-y-4">
        <FieldsFormComponents form={form} />
        <SubmitButtonFormComponents form={form} />
      </form>
    </Form>
  );
}
