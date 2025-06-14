import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/logo.svg';

export function Header() {
  return (
    <header className="h-24 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src={Logo} alt="TuneReveal logo" priority className="border border-border rounded-lg z-10 w-8 h-8" />
        <p className="text-xl text-foreground/95 font-medium leading-none hidden min-[20rem]:flex">TuneReveal</p>
      </div>

      <div className="flex items-center gap-x-2">
        <p className="text-foreground leading-none text-sm font-medium">
          Built by{' '}
          <Link href="https://duardodev.vercel.app/en" target="_blank" className="underline-offset-4 underline">
            duardodev
          </Link>
        </p>
        <ExternalLink size={16} />
      </div>
    </header>
  );
}
