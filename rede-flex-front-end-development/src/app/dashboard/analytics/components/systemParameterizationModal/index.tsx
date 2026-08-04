"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { createContext } from "react";
import SystemParameterizationModalContent from "./content";
import { SystemParameterizationModalProvider } from "./context";
import SystemParameterizationModalTrigger from "./trigger";

export const ConfigurationContext = createContext<any>(null);

export default function SystemParameterizationModal() {
  return (
    <Dialog defaultOpen={false}>
      <SystemParameterizationModalTrigger />
      <DialogContent
        className="
            z-50 transition-all duration-300 overflow-y-auto
            w-[90vw]
            sm:w-[80vw]
            md:w-[70vw]
            lg:w-[60vw]
            xl:w-[50vw]
            2xl:max-w-[1400px]
            max-h-[90vh]
          "
        style={{
          width: "max-content",
          maxWidth: "90vw",
        }}
      >
        <DialogHeader>
          <DialogTitle>Setup do Sistema</DialogTitle>
          <DialogDescription>
            Este formulário preenche os parâmetros da operação
          </DialogDescription>
          <Separator />
        </DialogHeader>
        <SystemParameterizationModalProvider>
          <SystemParameterizationModalContent />
        </SystemParameterizationModalProvider>
      </DialogContent>
    </Dialog>
  );
}
