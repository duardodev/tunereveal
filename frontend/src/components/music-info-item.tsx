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
        <p className="text-zinc-900 font-bold capitalize">{value}</p>
      ) : (
        <Skeleton className={`h-5 ${skeletonWidth}`} />
      )}
      <p className="text-zinc-700">{label}</p>
    </div>
  );
}
