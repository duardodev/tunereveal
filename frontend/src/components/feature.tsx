import { cn } from '@/lib/utils';
import { Icon } from '@phosphor-icons/react/dist/lib/types';

interface FeatureProps {
  icon: Icon;
  heading: string;
  paragraph: string;
}

export function Feature({ heading, paragraph, icon: Icon }: FeatureProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row w-full md:max-w-[450px] animate-shine items-center gap-5 rounded-xl md:border',
        'border-border bg-[length:400%_100%]',
        'md:p-4 transition-colors md:bg-[linear-gradient(110deg,#0e0e12,45%,#17171d,55%,#0e0e12)]'
      )}
    >
      <Icon className="h-12 max-w-12 sm:h-14 sm:max-w w-full text-red" color="#fb2c36" />
      <div className="max-w-2xs lg:max-w-full">
        <h2 className="text-foreground/90 text-xl md:text-2xl text-center md:text-start font-medium">{heading}</h2>
        <p className="sm:text-lg text-center md:text-start text-foreground/85">{paragraph}</p>
      </div>
    </div>
  );
}
