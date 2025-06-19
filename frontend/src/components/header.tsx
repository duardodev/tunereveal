import { Github } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/logo.svg';

export function Header() {
  return (
    <header className="h-24 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src={Logo} alt="TuneReveal logo" priority className="border border-border rounded-lg z-10 w-8 h-8" />
        <p className="text-lg text-foreground/95 font-medium leading-none hidden min-[20rem]:flex">TuneReveal</p>
      </div>

      <div className="flex items-center gap-x-7">
        <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors leading-none text-sm">
          How it Works
        </Link>

        <Button asChild size="sm" className="h-7 bg-foreground hover:bg-foreground/90 text-zinc-900">
          <Link href="https://github.com/duardodev/tunereveal" target="_blank">
            <Github />
            <span className="hidden sm:flex">GitHub</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
