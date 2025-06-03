import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { ReactNode } from 'react';

interface MusicInfoItemProps {
  label: string | ReactNode;
  value?: string | number;
  skeletonWidth?: string;
  capitalize?: boolean;
}

export function MusicInfoItem({ label, value, skeletonWidth, capitalize = false }: MusicInfoItemProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      {value !== undefined ? (
        <p className={cn('text-secondary-foreground font-bold', capitalize && 'capitalize')}>{value}</p>
      ) : (
        <Skeleton className={`h-5 ${skeletonWidth}`} />
      )}
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}
