import { numberToPercentage } from '@/lib/utils';
import { TrendingDownIcon } from 'lucide-react';

function TrendingDown({ value }: { value: number }) {
  return (
    <div className='flex items-center justify-center gap-1'>
      <TrendingDownIcon className='text-red-600' size='14px' />
      <div className='rounded-full font-semibold bg-red-600 text-white hover:bg-red-700/80 text-xs px-2 py-0'>
        {numberToPercentage(value, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </div>
    </div>
  );
}

export default TrendingDown;
