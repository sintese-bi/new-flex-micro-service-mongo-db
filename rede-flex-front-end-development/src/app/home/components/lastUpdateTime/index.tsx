'use client';
import { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { Separator } from '@/components/ui/separator';
import CircularLoading from '@/components/loading/circularLoading';
export default function Time({
  date,
  isLoading,
  secondsToUpdate,
}: {
  date: Date | null;
  isLoading: boolean;
  secondsToUpdate: number;
}) {
  return (
    <div className='flex flex-col gap-2' style={{ width: '145px' }}>
      <div className='flex flex-col gap-1'>
        <p className='text-xs font-bold'>Atualizado em:</p>
        <Separator />
      </div>
      <div className='flex justify-center items-center px-1 py-2 rounded-md border-[1px] border-2 gap-1'>
        <p className='text-xs font-bold'>
          {date
            ? formatInTimeZone(date, 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm')
            : '--'}
        </p>
        <div>|</div>
        <span className='text-xs text-center' style={{ width: '20px' }}>
          {isLoading ? (
            <div className='inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-main-color' />
          ) : (
            secondsToUpdate
          )}
        </span>
      </div>
    </div>
  );
}
