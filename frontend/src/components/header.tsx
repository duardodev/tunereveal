import { Github } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/logo.svg';

export function Header() {
  return (
    <header className="h-28 py-4 flex flex-col sm:flex-row gap-5 items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src={Logo} alt="TuneReveal logo" priority className="border border-border rounded-lg z-10 w-8 h-8" />
        <p className="text-lg text-foreground/95 font-medium leading-none hidden min-[20rem]:flex">TuneReveal</p>
      </div>

      <div className="flex items-center gap-x-5">
        <Link href="#how-it-works" className=" text-gray-200 hover:text-white transition-colors leading-none text-sm">
          How it Works
        </Link>

        <Link href="https://www.buymeacoffee.com/tunereveal" target="_blank">
          <Image
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            width={160}
            height={40}
            className="w-32 h-8 hover:scale-105 transition-transform duration-200"
            priority
          />
        </Link>

        <Button asChild size="sm" className="h-8 bg-foreground hover:bg-foreground/90 text-zinc-900">
          <Link href="https://github.com/duardodev/tunereveal" target="_blank">
            <Github />
          </Link>
        </Button>
      </div>
    </header>
  );
}
