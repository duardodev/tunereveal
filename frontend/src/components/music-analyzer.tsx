'use client';

import mql from '@microlink/mql';
import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { YoutubeLogo, MagnifyingGlass, CircleNotch, Check, X } from '@phosphor-icons/react/dist/ssr';
import { isValidYouTubeUrl } from '@/utils/is-valid-youtube-url';
import { Skeleton } from './ui/skeleton';

interface AnalysisData {
  bpm: number;
  key: string;
}

export function MusicAnalyzer() {
  const [isDisabled, setIsDisabled] = useState(true);

  const {
    mutateAsync: fetchMetadata,
    data: metadata,
    isPending: isFetchingMetadata,
    isSuccess: isMetadataFetched,
    isError: isMetadataFetchError,
  } = useMutation({
    mutationFn: async (videoUrl: string) => {
      const { data } = await mql(videoUrl, { video: true });
      return data;
    },
  });

  const {
    mutateAsync: fetchAnalysis,
    data: analysis,
    isPending: isFetchingAnalysis,
    isSuccess: isAnalysisFetched,
    isError: isAnalysisFetchError,
  } = useMutation({
    mutationFn: async (videoUrl: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audio/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      });

      const data = await response.json();
      return data as AnalysisData;
    },
  });

  function handleAnalyze(formData: FormData) {
    const videoUrl = formData.get('videoUrl') as string;

    if (!isValidYouTubeUrl(videoUrl)) {
      toast.error('This URL is not valid!', {
        description: 'It looks like this URL is not from YouTube. Try copying and pasting it again.',
      });
      throw new Error();
    }

    fetchMetadata(videoUrl);
    fetchAnalysis(videoUrl);
  }

  function handleGetYoutubeVideoId(videoUrl: string) {
    const id = videoUrl?.split('v=')[1];
    return id ? id.substring(0, 11) : null;
  }

  return (
    <div className="w-full max-w-96 mt-0 md:mt-5 flex flex-col gap-6 md:gap-10">
      <form action={handleAnalyze} className="w-full flex items-center gap-3 md:gap-6">
        <div className="w-full bg-foreground px-3 md:px-4 py-2 rounded-xl flex items-center">
          <YoutubeLogo size={24} color="#f41919" weight="fill" />
          <input
            type="text"
            name="videoUrl"
            onChange={e => setIsDisabled(e.target.value.trim() === '')}
            className="w-[80%] px-1 ml-1 bg-transparent focus:outline-zinc-400/90 rounded-md text-zinc-950 placeholder:text-[#444444] text-sm md:text-base"
            placeholder="Paste the YouTube URL here..."
          />

          {(isFetchingMetadata || isFetchingAnalysis) && (
            <CircleNotch size={20} className="animate-spin text-zinc-600 ml-auto" />
          )}
          {isMetadataFetched && isAnalysisFetched && (
            <Check size={20} className="text-green-500 ml-auto" weight="bold" />
          )}
          {(isMetadataFetchError || isAnalysisFetchError) && (
            <X size={20} weight="bold" className="text-red-600 ml-auto" />
          )}
        </div>

        <button
          type="submit"
          disabled={isDisabled || isFetchingMetadata || isFetchingAnalysis}
          className="bg-foreground cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:bg-zinc-200 transition-all w-10 sm:w-12 h-10 flex items-center justify-center rounded-xl"
        >
          <MagnifyingGlass className="text-zinc-950" size={24} />
        </button>
      </form>

      <div className="bg-foreground w-full rounded-xl p-4 md:p-5 space-y-4 md:space-y-5">
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
          {isAnalysisFetched ? (
            <>
              <div className="flex flex-col items-center justify-center">
                <p className="text-zinc-700 font-bold">{analysis.bpm}</p>
                <p className="text-zinc-700">BPM</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <p className="text-zinc-700 font-bold">{analysis.key}</p>
                <p className="text-zinc-700">Key</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <Skeleton className="h-5 w-7" />
                <p className="text-zinc-700">Camelot</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center">
                <Skeleton className="h-5 w-9" />
                <p className="text-zinc-700">BPM</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <Skeleton className="h-5 w-14" />
                <p className="text-zinc-700">Key</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <Skeleton className="h-5 w-7" />
                <p className="text-zinc-700">Camelot</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
