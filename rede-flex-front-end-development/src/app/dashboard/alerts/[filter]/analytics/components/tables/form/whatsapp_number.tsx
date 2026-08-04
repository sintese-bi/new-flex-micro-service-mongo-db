"use client";
import { Input } from "@/components/ui/input";
import { PhoneIcon } from "lucide-react";
import { useState } from "react";

export default function WhatsAppNumber({
  gas_station_whats_app,
}: {
  gas_station_whats_app: string;
}) {
  const [value, setValue] = useState(gas_station_whats_app);

  function isDeletingValue(inputValue: string, value: string): boolean {
    return inputValue.length >= value.length ? false : true;
  }

  const handleChange = (e: any) => {
    let inputValue: string = e.target.value;
    const is_deleting = isDeletingValue(inputValue, value);
    if (inputValue != "(" && inputValue.length == 1) {
      setValue("(");
    } else if (inputValue.length == 15 && !is_deleting) {
      setValue(`${value}(`);
    } else if (inputValue.length == 29 && !is_deleting) {
      setValue(`${value}(`);
    } else if (inputValue.length == 4 && !is_deleting) {
      setValue(`${value})`);
    } else if (inputValue.length == 18 && !is_deleting) {
      setValue(`${value})`);
    } else if (inputValue.length == 32 && !is_deleting) {
      setValue(`${value})`);
    } else if (inputValue.length == 13 && !is_deleting) {
      setValue(`${inputValue} `);
    } else if (inputValue.length == 27 && !is_deleting) {
      setValue(`${inputValue} `);
    } else {
      const formattedValue = inputValue.replace(/[^0-9\s()]/g, "").slice(0, 41);
      setValue(formattedValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <PhoneIcon size={18} />
      <Input
        className="text-xs w-72"
        name="whatsapp_contact"
        value={value}
        onChange={handleChange}
        placeholder="(88)992045342"
      />
    </div>
  );
}
