import { Feature } from '@/components/feature';
import { MusicAnalyzer } from '@/components/music-analyzer';
import { Metronome, MusicNote, Waveform } from '@phosphor-icons/react/dist/ssr';

export default function Home() {
  return (
    <main className="mt-2 pb-20 grid grid-cols-1 md:grid-cols-2 justify-items-center md:justify-items-end md gap-10 sm:gap-16">
      <div className="flex flex-col gap-8 sm:gap-14 w-full max-w-[600px]">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-center md:text-start leading-tight font-bold">
          Discover Your <br /> Music's DNA
        </h1>

        <div className="space-y-6 md:space-y-10 flex flex-col sm:flex-row md:flex-col flex-wrap md:items-start items-center justify-center">
          <Feature icon={MusicNote} heading="Get the Key" paragraph="Know your song's musical key instantly" />
          <Feature
            icon={Metronome}
            heading="BPM Analysis"
            paragraph="Feel the rhythm with beat-perfect tempo identification"
          />
          <Feature
            icon={Waveform}
            heading="More Track Datails"
            paragraph="Dive deep into your music's sonic fingerprint"
          />
        </div>
      </div>

      <MusicAnalyzer />
    </main>
  );
}
