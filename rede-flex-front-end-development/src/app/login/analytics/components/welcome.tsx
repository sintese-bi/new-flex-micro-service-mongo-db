import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function WelcomeComponents() {
  return (
    <div className="lg:flex md:flex hidden justify-center items-center flex-col gap-4">
      <p className="text-2xl text-white font-extrabold">Bem-vindo ao login</p>
      <p className="text-sm text-white">Não tem uma conta?</p>
      <Link href={"/register"}>
        <Button variant="outline" className="bg-transparent text-white">
          Cadastro
        </Button>
      </Link>
    </div>
  );
}
