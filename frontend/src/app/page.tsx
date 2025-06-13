import { Feature } from '@/components/feature';
import { MusicAnalyzer } from '@/components/music-analyzer';
import { Metronome, MusicNote, Waveform } from '@phosphor-icons/react/dist/ssr';

export default function Home() {
  return (
    <main className="mt-12 pb-8 md:pb-16 grid grid-cols-1 md:grid-cols-2 justify-items-center md:justify-items-end items-center gap-10 sm:gap-16">
      <div className="flex flex-col gap-8 sm:gap-14 w-full max-w-[600px]">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-center md:text-start leading-tight font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-neutral-300/90 bg-opacity-50 z-10">
          Uncover the Core of Any Sound<span className="text-red-500">.</span>
        </h1>

        <div className="space-y-8 flex flex-col sm:flex-row md:flex-col flex-wrap md:items-start items-center justify-center">
          <Feature icon={MusicNote} heading="Key Identification" paragraph="Get the musical key and Camelot code." />
          <Feature
            icon={Metronome}
            heading="Precise BPM Detection"
            paragraph="Get the exact tempo of any song in beats per minute."
          />
          <Feature
            icon={Waveform}
            heading="YouTube Music Analyzer"
            paragraph="Just paste a YouTube URL - we'll analyze BPM, key, and more."
          />
        </div>
      </div>

      <MusicAnalyzer />
    </main>
  );
}
