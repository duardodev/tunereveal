import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="skeleton" className={cn('bg-[#1f1f28] animate-pulse rounded-lg', className)} {...props} />;
}

export { Skeleton };
