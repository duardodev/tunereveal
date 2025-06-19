import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full mx-auto py-6 flex justify-center">
      <p className="text-muted-foreground leading-none text-sm">
        © 2025, built by{' '}
        <Link href="https://duardodev.vercel.app/en" target="_blank" className="hover:text-white transition-colors">
          Deivit Eduardo
        </Link>
        .
      </p>
    </footer>
  );
}
