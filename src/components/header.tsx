import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="h-20 flex items-center justify-end">
      <div className="flex gap-x-1.5">
        <p className="text-sm">
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
