import { numberToPercentage } from '@/lib/utils';
import { TrendingUpIcon } from 'lucide-react';

function TrendingUp({ value }: { value: number }) {
  return (
    <div className='flex items-center justify-center gap-1'>
      <TrendingUpIcon className='text-green-600' size='14px' />
      <div className='rounded-full font-semibold bg-green-600 text-white hover:bg-green-700/80 text-xs px-2 py-0'>
        {numberToPercentage(value, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </div>
    </div>
  );
}

export default TrendingUp;
