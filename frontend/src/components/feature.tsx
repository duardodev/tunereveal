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
        'flex flex-col md:flex-row w-full md:max-w-[480px] md:shadow-m animate-shine items-center gap-5 rounded-2xl md:border',
        'border-border/40 bg-[length:400%_100%]',
        'md:p-4 transition-colors md:bg-[linear-gradient(110deg,#0f0f14,45%,#17171d,55%,#0f0f14)]'
      )}
    >
      <Icon className="h-12 max-w-12 sm:max-w w-full text-primary" weight="duotone" />
      <div className="max-w-2xs lg:max-w-full">
        <h2 className="text-foreground/95 text-xl text-center md:text-start font-bold">{heading}</h2>
        <p className="text-center md:text-start text-foreground/90">{paragraph}</p>
      </div>
    </div>
  );
}
