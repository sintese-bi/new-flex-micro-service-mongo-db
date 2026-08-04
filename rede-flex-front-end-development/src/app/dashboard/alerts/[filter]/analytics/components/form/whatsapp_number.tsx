"use client";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";
import InputMask from "react-input-mask";
import { Label } from "@/components/ui/label";

export default function WhatsAppNumberComponentsAlerts() {
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-col w-full gap-1">
        <Label>Números de telefone</Label>
        <p className="text-xs text-gray-600">
          Adicione no mínimo um número de telefone para receber os alertas,
          lembrando que, caso você digite um número inválido (incompleto) não
          iremos considerar.
        </p>
      </div>
      {/* <InputMask
        mask="(99) 99999-9999"
        onChange={() => {}}
        maskPlaceholder="(99) 99999-9999"
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            className="w-full text-xs"
            name="whatsapp_contact"
          />
        )}
      </InputMask> */}
    </div>
  );
}
