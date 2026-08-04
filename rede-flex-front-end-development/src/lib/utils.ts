import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function numberToCurrency(
  value: number,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    ...options,
  }).format(value);
}

export function numberToPercentage(
  value: number,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    currency: 'BRL',
    minimumFractionDigits: 2,
    ...options,
  }).format(value / 100);
}

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    currency: 'BRL',
    ...options,
  }).format(value);
}
