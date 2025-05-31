import { Skeleton } from './ui/skeleton';

interface MusicInfoItemProps {
  label: string;
  value?: string | number;
  skeletonWidth?: string;
}

export function MusicInfoItem({ label, value, skeletonWidth }: MusicInfoItemProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      {value !== undefined ? (
        <p className="text-secondary-foreground font-bold capitalize">{value}</p>
      ) : (
        <Skeleton className={`h-5 ${skeletonWidth}`} />
      )}
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}
