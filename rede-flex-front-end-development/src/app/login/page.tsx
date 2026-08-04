"use client";
import Image from "next/image";
import Link from "next/link";
import WelcomeComponents from "./analytics/components/welcome";
import FormComponents from "./analytics/components/form";
export default function Login() {
  return (
    <main className="w-full h-screen flex items-center justify-center">
      <div className="flex w-full lg:w-2/3 md:w-5/6 h-full lg:h-2/3 md:h-2/3 shadow-2xl">
        <div className="flex lg:flex md:flex sm:hidden xs:hidden hidden w-2/4 h-full flex-col items-center justify-center">
          <Image
            src="/logo.png"
            alt="redeflex_logo"
            width={120}
            height={120}
            priority={true}
            className="w-auto h-auto"
          />
          <FormComponents />
        </div>
        <div className="flex flex-col lg:justify-center md:justify-center justify-start items-center w-full lg:w-2/4 md:w-2/4 h-full lg:rounded-none md:rounded-none sm:rounded-md xs:rounded-md rounded-md bg-main-color gap-6">
          <div className="flex lg:hidden md:hidden sm:flex md:flex flex justify-center items-bottom py-8 w-full bg-white">
            <Image
              src="/logo.png"
              width={160}
              height={160}
              alt="redeflex logo"
              className="w-auto h-auto"
            />
          </div>
          <WelcomeComponents />
          <div className="lg:hidden md:hidden flex justify-center items-center flex-col w-full">
            <FormComponents />
          </div>
          <div className="lg:hidden md:hidden flex flex-col gap-2 w-4/5 text-slate-200 text-xs mt-8">
            <p>Não tem uma conta?</p>
            <Link href={"/register"} className="underline">
              Cadastrar
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
