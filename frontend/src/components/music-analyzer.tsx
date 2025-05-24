'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { YoutubeLogo, MagnifyingGlass, CircleNotch, Check, X } from '@phosphor-icons/react/dist/ssr';
import { isValidYouTubeUrl } from '@/utils/is-valid-youtube-url';
import { Skeleton } from './ui/skeleton';
import { MusicInfoItem } from './music-info-item';
import { useMusicAnalyzer } from '@/hooks/use-music-analyzer';

export function MusicAnalyzer() {
  const [isDisabled, setIsDisabled] = useState(true);
  const {
    fetchMetadata,
    fetchAnalysis,
    metadata,
    analysis,
    isLoading,
    isSuccess,
    isError,
    isAnalysisFetched,
    isMetadataFetched,
  } = useMusicAnalyzer();

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

  function handleGetYoutubeVideoId(videoUrl?: string) {
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
            disabled={isLoading}
            className="w-[80%] px-1 ml-1 bg-transparent disabled:cursor-not-allowed focus:outline-zinc-400/90 rounded-md text-zinc-950 placeholder:text-[#444444] text-sm md:text-base"
            placeholder="Paste the YouTube URL here..."
          />

          {isLoading && <CircleNotch size={20} className="animate-spin text-zinc-600 ml-auto" />}
          {isSuccess && <Check size={20} className="text-green-500 ml-auto" weight="bold" />}
          {isError && <X size={20} weight="bold" className="text-red-600 ml-auto" />}
        </div>

        <button
          type="submit"
          disabled={isDisabled || isLoading}
          className="bg-foreground cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:bg-zinc-200 transition-all w-10 sm:w-12 h-10 flex items-center justify-center rounded-xl"
        >
          <MagnifyingGlass className="text-zinc-950" size={24} />
        </button>
      </form>

      <div className="bg-foreground w-full rounded-xl p-4 md:p-5 space-y-4 md:space-y-5">
        {isMetadataFetched ? (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${handleGetYoutubeVideoId(metadata?.url)}`}
              className="w-full h-40 md:h-52 rounded-lg"
            />
            <p className="mt-5 text-zinc-950 font-medium">{metadata?.title}</p>
          </>
        ) : (
          <>
            <Skeleton className="w-full h-40 md:h-52" />
            <Skeleton className="h-5 md:h-6 w-[60%]" />
          </>
        )}

        <div className="flex flex-wrap justify-center gap-x-18 gap-y-2 text-sm md:text-base">
          {isAnalysisFetched ? (
            <>
              <MusicInfoItem label="BPM" value={analysis?.bpm} />
              <MusicInfoItem label="Key" value={analysis?.key} />
              <MusicInfoItem label="Camelot" value={analysis?.camelot} />
              <MusicInfoItem label="Energy" value={analysis?.energy} />
              <MusicInfoItem label="Loudness" value={analysis?.loudness} />
            </>
          ) : (
            <>
              <MusicInfoItem label="BPM" skeletonWidth="w-9" />
              <MusicInfoItem label="Key" skeletonWidth="w-14" />
              <MusicInfoItem label="Camelot" skeletonWidth="w-7" />
              <MusicInfoItem label="Energy" skeletonWidth="w-7" />
              <MusicInfoItem label="Loudness" skeletonWidth="w-7" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
