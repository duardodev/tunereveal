'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { YoutubeLogo, MagnifyingGlass, CircleNotch, Check, X } from '@phosphor-icons/react/dist/ssr';
import { isValidYouTubeUrl } from '@/utils/is-valid-youtube-url';
import { Skeleton } from './ui/skeleton';
import { MusicInfoItem } from './music-info-item';
import { useMusicAnalyzer } from '@/hooks/use-music-analyzer';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Info } from '@phosphor-icons/react';

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
      return;
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
        <div className="w-full bg-[#121217] border border-border hover:border-muted-foreground transition-all px-3 md:px-4 py-2 rounded-xl flex items-center">
          <YoutubeLogo size={24} color="#ed1313" weight="duotone" />
          <input
            type="text"
            name="videoUrl"
            onChange={e => setIsDisabled(e.target.value.trim() === '')}
            disabled={isLoading}
            className="w-[80%] px-1 ml-1 bg-transparent disabled:cursor-not-allowed outline-0 rounded-md text-foreground placeholder:text-foreground/95 text-sm md:text-base"
            placeholder="Paste the YouTube URL here..."
          />

          {isLoading && <CircleNotch size={20} className="animate-spin text-zinc-600 ml-auto" />}
          {isSuccess && <Check size={20} className="text-green-500 ml-auto" weight="bold" />}
          {isError && <X size={20} weight="bold" className="text-red-600 ml-auto" />}
        </div>

        <button
          type="submit"
          disabled={isDisabled || isLoading}
          className="bg-[#121217] border border-border cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:bg-muted transition-all w-10 sm:w-12 h-10 flex items-center justify-center rounded-xl"
        >
          <MagnifyingGlass size={24} color="#efeaea" />
        </button>
      </form>

      <div className="bg-[#121217] border border-border w-full rounded-xl p-4 md:p-5 space-y-4 md:space-y-5">
        {isMetadataFetched ? (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${handleGetYoutubeVideoId(metadata?.url)}`}
              className="w-full h-40 md:h-52 rounded-lg"
            />
            <p className="mt-5 text-secondary-foreground font-medium">{metadata?.title}</p>
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

              <Tooltip>
                <TooltipTrigger>
                  <MusicInfoItem
                    label={
                      <span className="flex items-center gap-1.5">
                        Key
                        <Info size={16} color="gray" />
                      </span>
                    }
                    value={analysis?.key}
                    capitalize={true}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Alternative Key: <span className="font-bold capitalize">{analysis?.alternativeKey}</span>
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <MusicInfoItem
                    label={
                      <span className="flex items-center gap-1.5">
                        Camelot
                        <Info size={16} color="gray" />
                      </span>
                    }
                    value={analysis?.camelot}
                    capitalize={true}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Alternative Camelot: <span className="font-bold">{analysis?.alternativeCamelot}</span>
                  </p>
                </TooltipContent>
              </Tooltip>

              <MusicInfoItem label="Time Signature" value={`${analysis?.timeSignature}`} />
              <MusicInfoItem label="Loudness" value={`${analysis?.loudness} dB`} />
            </>
          ) : (
            <>
              <MusicInfoItem label="BPM" skeletonWidth="w-9" />
              <MusicInfoItem label="Key" skeletonWidth="w-14" />
              <MusicInfoItem label="Camelot" skeletonWidth="w-7" />
              <MusicInfoItem label="Time Signature" skeletonWidth="w-7" />
              <MusicInfoItem label="Loudness" skeletonWidth="w-7" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
