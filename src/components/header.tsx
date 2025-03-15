import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/logo.svg';

export function Header() {
  return (
    <header className="h-24 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src={Logo} alt="TuneReveal logo" className="w-8 h-8" />
        <p className="text-xl font-medium">TuneReveal</p>
      </div>

      <div className="flex gap-x-1.5">
        <p className="text-foreground text-sm font-medium">
          Built by{' '}
          <Link href="https://duardodev.vercel.app/en" target="_blank" className="underline-offset-2 underline">
            duardodev
          </Link>
        </p>
        <ExternalLink size={16} />
      </div>
    </header>
  );
}
