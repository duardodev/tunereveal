import { Feature } from '@/components/feature';
import { Skeleton } from '@/components/ui/skeleton';
import { MagnifyingGlass, Metronome, MusicNote, Waveform, YoutubeLogo } from '@phosphor-icons/react/dist/ssr';

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

      <div className="w-full max-w-96 mt-0 md:mt-5 flex flex-col gap-6 md:gap-10">
        <div className="w-full flex items-center gap-3 md:gap-6">
          <div className="w-full bg-zinc-100 px-3 md:px-4 py-2 rounded-xl flex items-center">
            <YoutubeLogo size={24} color="#f41919" weight="fill" />
            <input
              className="w-full px-1 ml-1 bg-transparent focus:outline-zinc-400/90 rounded-md text-zinc-950 placeholder:text-[#444444] text-sm md:text-base"
              placeholder="Paste YouTube URL here..."
            />
          </div>

          <button className="bg-zinc-100 cursor-pointer hover:bg-zinc-200 transition-colors w-10 sm:w-12 h-10 flex items-center justify-center rounded-xl">
            <MagnifyingGlass className="text-zinc-950" size={24} />
          </button>
        </div>

        <div className="bg-zinc-100 w-full rounded-xl p-4 md:p-5 space-y-4 md:space-y-5">
          <Skeleton className="w-full h-40 md:h-52" />

          <div className="flex items-center justify-between">
            <Skeleton className="h-5 md:h-6 w-[60%]" />
            <Skeleton className="h-5 md:h-6 w-10 md:w-12" />
          </div>

          <div className="grid grid-cols-3 justify-items-center gap-2 text-sm md:text-base">
            <div className="flex flex-col items-center justify-center">
              <Skeleton className="h-5 w-14" />
              <p className="text-zinc-700">Key</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Skeleton className="h-5 w-9" />
              <p className="text-zinc-700">BPM</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Skeleton className="h-5 w-7" />
              <p className="text-zinc-700">Camelot</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
