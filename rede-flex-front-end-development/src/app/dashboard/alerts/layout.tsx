import { Separator } from "@/components/ui/separator";
import FilterOptions from "./[filter]/analytics/components/filter_options";

export default async function AlertsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col h-screen w-full gap-8">
      <div className="flex flex-col gap-4">
        <p className="text-xs font-bold text-slate-400 lg:w-2/6  w-full">
          Você deve selecionar as variáveis que deseja monitorar. As variáveis
          selecionadas são observadas 24/7 e, caso ao fim do dia elas não tenham
          alcançado o valor esperado, é enviado uma mensagem de alerta no seu
          whatapp
        </p>
        <Separator />
      </div>
      {children}
    </section>
  );
}
