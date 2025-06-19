import { Hero } from '@/components/hero';
import { HowItWorks } from '@/components/how-it-works';

export default function Home() {
  return (
    <main className="mt-12 pb-8 md:pb-16">
      <Hero />
      <HowItWorks />
    </main>
  );
}
