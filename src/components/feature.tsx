import { Icon } from '@phosphor-icons/react/dist/lib/types';

interface FeatureProps {
  icon: Icon;
  heading: string;
  paragraph: string;
}

export function Feature({ heading, paragraph, icon: Icon }: FeatureProps) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-5">
      <Icon className="h-12 max-w-12 sm:h-14 sm:max-w-14 w-full" />
      <div className="max-w-2xs lg:max-w-full">
        <h2 className="text-xl md:text-2xl text-center md:text-start font-bold">{heading}</h2>
        <p className="sm:text-lg text-center md:text-start">{paragraph}</p>
      </div>
    </div>
  );
}
