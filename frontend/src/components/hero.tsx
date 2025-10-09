import { Feature } from './feature';
import { MusicAnalyzer } from './music-analyzer';
import { MusicNote, Metronome, Waveform } from '@phosphor-icons/react/dist/ssr';
import { GetStartedGradientBanner } from './ui/get-started-gradient-banner';

export function Hero() {
  return (
    <section
      id="hero"
      className="-scroll-mt-96 md:scroll-mt-40 grid grid-cols-1 md:grid-cols-2 justify-items-center md:justify-items-end items-center gap-10 sm:gap-16"
    >
      <div className="flex flex-col gap-10 w-full items-center md:items-start max-w-[600px]">
        <h1 className="text-4xl sm:text-5xl text-center md:text-start leading-tight font-semibold tracking-tight text-foreground z-10">
          Uncover the Core <br />
          <span className="text-gradient">of Any Music</span>
        </h1>

        <GetStartedGradientBanner />

        <div className="space-y-8 flex flex-col sm:flex-row md:flex-col flex-wrap md:items-start items-center justify-center">
          <Feature icon={MusicNote} heading="Key Identification" paragraph="Get the musical key and Camelot code." />
          <Feature
            icon={Metronome}
            heading="Precise BPM Detection"
            paragraph="Get the exact tempo of any track in BPM."
          />
          <Feature
            icon={Waveform}
            heading="YouTube Music Analyzer"
            paragraph="Paste a YouTube music link — we'll analyze BPM, key, and more."
          />
        </div>
      </div>

      <MusicAnalyzer />
    </section>
  );
}
