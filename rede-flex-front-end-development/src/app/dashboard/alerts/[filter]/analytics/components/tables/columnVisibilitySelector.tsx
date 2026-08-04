import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EyeIcon } from "lucide-react"; // Certifique-se de importar o ícone correto
export default function ColumnVisibilityToggle({ column }: any) {
  return (
    <div className="flex justify-end w-full my-4 px-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="text-sm text-white p-2 bg-main-color rounded-md">
          Margens selecionadas
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top">
          <DropdownMenuItem
            className="space-x-2"
            onClick={() => column.toggleVisibility()} // Alterna a visibilidade
          >
            <EyeIcon size={18} />
            <p>{column.getIsVisible() ? "Ocultar" : "Mostrar"}</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
