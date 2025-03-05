'use client';

import mql from '@microlink/mql';
import { useMutation } from '@tanstack/react-query';
import { YoutubeLogo, MagnifyingGlass, CircleNotch, Check, X } from '@phosphor-icons/react/dist/ssr';
import { Skeleton } from './ui/skeleton';

export function MusicAnalyzer() {
  const {
    mutate: handleAnalyze,
    data: metadata,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (formData: FormData) => {
      const url = formData.get('url') as string;

      if (!url.includes('https://') || !url.includes('youtu')) {
        throw new Error();
      }

      const { data } = await mql(url, { video: true });
      return data;
    },
  });

  function handleGetYoutubeVideoId(url: string) {
    const id = url?.split('v=')[1];
    return id ? id.substring(0, 11) : null;
  }

  return (
    <div className="w-full max-w-96 mt-0 md:mt-5 flex flex-col gap-6 md:gap-10">
      <form action={handleAnalyze} className="w-full flex items-center gap-3 md:gap-6">
        <div className="w-full bg-zinc-100 px-3 md:px-4 py-2 rounded-xl flex items-center">
          <YoutubeLogo size={24} color="#f41919" weight="fill" />
          <input
            type="text"
            name="url"
            className="w-[76%] px-1 ml-1 bg-transparent focus:outline-zinc-400/90 rounded-md text-zinc-950 placeholder:text-[#444444] text-sm md:text-base"
            placeholder="Paste YouTube URL here..."
          />

          {isPending && <CircleNotch size={20} className="animate-spin text-zinc-600 ml-auto" />}
          {isSuccess && <Check size={20} className="text-green-500 ml-auto" weight="bold" />}
          {isError && <X size={20} weight="bold" className="text-red-600 ml-auto" />}
        </div>

        <button
          type="submit"
          className="bg-zinc-100 cursor-pointer hover:bg-zinc-200 transition-colors w-10 sm:w-12 h-10 flex items-center justify-center rounded-xl"
        >
          <MagnifyingGlass className="text-zinc-950" size={24} />
        </button>
      </form>

      <div className="bg-zinc-100 w-full rounded-xl p-4 md:p-5 space-y-4 md:space-y-5">
        {metadata?.url ? (
          <iframe
            src={`https://www.youtube.com/embed/${handleGetYoutubeVideoId(metadata.url)}`}
            className="w-full h-40 md:h-52 rounded-lg"
          />
        ) : (
          <Skeleton className="w-full h-40 md:h-52" />
        )}

        {metadata?.title ? (
          <p className="mt-5 text-zinc-950 font-medium">{metadata.title}</p>
        ) : (
          <Skeleton className="h-5 md:h-6 w-[60%]" />
        )}

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
  );
}
