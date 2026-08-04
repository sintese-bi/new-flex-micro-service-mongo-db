"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChartHorizontalBigIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
export default function DashboardComponentsNavbarMenuDropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-1 py-1 bg-main-color text-white text-sm rounded-md font-medium ">
        <MenuIcon size={28} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        <DropdownMenuLabel>Menu navegação</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div className="flex justify-start gap-2 items-center py-1 w-full cursor-pointer">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            className="flex justify-start group-hover:justify-start gap-2 items-center py-1 w-full cursor-pointer"
            href={"/dashboard"}
          >
            <HomeIcon size={22} />
            <p className="text-xs">Home</p>
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          <Link
            className="flex justify-start group-hover:justify-start gap-2 items-center py-1 w-full cursor-pointer"
            href={"/dashboard/analisys"}
          >
            <BarChartHorizontalBigIcon size={22} />
            <p className="text-xs">Análises</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            className="flex justify-start group-hover:justify-start gap-2 items-center py-1 w-full cursor-pointer"
            href={"/dashboard/alerts"}
          >
            <TriangleAlertIcon size={22} />
            <p className="text-xs">Alertas</p>
          </Link>
        </DropdownMenuItem> */}
        <DropdownMenuItem>
          <Link
            className="flex justify-start group-hover:justify-start gap-2 items-center py-1 w-full cursor-pointer"
            href={"/"}
          >
            <LogOutIcon size={22} />
            <p className="text-xs">Sair</p>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
