import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  currentSection: 0 | 1 | 2;
  currentSecondarySection: 0 | 1 | 2 | 3;
  setCurrentSecondarySection: Dispatch<SetStateAction<0 | 1 | 2 | 3>>;
}

function DesktopSecondarySectionSelector({
  currentSection,
  currentSecondarySection,
  setCurrentSecondarySection,
}: Props) {
  const selectedStyle = "border-b-[1px] border-main-color rounded-none";

  if (currentSection === 0 || currentSection === 2) return null;

  return (
    <div className="flex justify-center w-full gap-4 my-4">
      <Button
        variant="ghost"
        type="button"
        className={`flex flex-col border-0 ${
          currentSecondarySection === 0 ? selectedStyle : ""
        }`}
        onClick={() => setCurrentSecondarySection(0)}
      >
        <p>Meta TMs, RBs e LB</p>
        <p>(Valores descritos no mapa)</p>
      </Button>

      <Button
        variant="ghost"
        type="button"
        className={`flex flex-col border-0 ${
          currentSecondarySection === 2 ? selectedStyle : ""
        }`}
        onClick={() => setCurrentSecondarySection(2)}
      >
        <p>Meta Mensal Galonagem & Produto</p>
        <p>(Valores descritos nos gráficos)</p>
      </Button>

      <Button
        variant="ghost"
        type="button"
        className={`flex flex-col border-0 ${
          currentSecondarySection === 1 ? selectedStyle : ""
        }`}
        onClick={() => setCurrentSecondarySection(1)}
      >
        <p>Descontos de combustíveis</p>
        <p>(Valores utilizados no cálculo de combustível)</p>
      </Button>
    </div>
  );
}

function MobileSecondarySectionSelector({
  currentSection,
  currentSecondarySection,
  setCurrentSecondarySection,
}: Props) {
  function handleOnChange(value: string) {
    setCurrentSecondarySection(Number(value) as 0 | 1 | 2 | 3);
  }

  if (currentSection === 0 || currentSection === 2) return null;

  return (
    <Select
      value={String(currentSecondarySection)}
      onValueChange={handleOnChange}
    >
      <SelectTrigger className="w-full max-w-[500px] my-4 mx-auto">
        <SelectValue placeholder="Selecione uma opção de configuração" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0">
          Meta TMs, RBs e LB (Valores descritos no mapa)
        </SelectItem>
        <SelectItem value="2">
          Meta Mensal Galonagem & Produto (Valores descritos nos gráficos)
        </SelectItem>
        <SelectItem value="1">
          Descontos de combustíveis (Valores utilizados no cálculo de
          combustível)
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export default function ResponsiveSecondarySectionSelector(props: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? (
    <MobileSecondarySectionSelector {...props} />
  ) : (
    <DesktopSecondarySectionSelector {...props} />
  );
}
