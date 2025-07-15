'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { YoutubeLogo, MagnifyingGlass, CircleNotch, Check, X } from '@phosphor-icons/react/dist/ssr';
import { normalizeYouTubeUrl } from '@/utils/normalize-youtube-url';
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

  async function handleAnalyze(formData: FormData) {
    const videoUrl = formData.get('videoUrl') as string;
    const normalizedUrl = normalizeYouTubeUrl(videoUrl);

    if (!normalizedUrl) {
      toast.error('Invalid YouTube link!', {
        closeButton: true,
        description: 'Please enter a valid YouTube video link.',
      });
      return;
    }

    toast.info('Analyzing your music... This may take a few minutes depending on the song duration.', {
      closeButton: true,
      duration: 7000,
    });

    try {
      fetchMetadata(normalizedUrl);
      await fetchAnalysis(normalizedUrl);

      toast.success('Music analysis completed!', {
        closeButton: true,
        description: 'You can now view the music details below. 111111',
        duration: 5000,
      });
    } catch (error) {
      console.error('Error during music analysis:', error);

      toast.error('Failed to analyze the music!', {
        closeButton: true,
        description: 'Server error during analysis. Please try again later.',
        duration: 7000,
      });
    }
  }

  function handleGetYoutubeVideoId(videoUrl?: string) {
    const normalizedUrl = normalizeYouTubeUrl(videoUrl || '');
    if (!normalizedUrl) return null;

    const url = new URL(normalizedUrl);
    return url.searchParams.get('v') || null;
  }

  return (
    <div className="w-full max-w-96 mt-0 md:mt-5 flex flex-col gap-6 md:gap-10">
      <form
        onSubmit={async e => {
          e.preventDefault();
          await handleAnalyze(new FormData(e.currentTarget));
        }}
        className="w-full flex items-center gap-3 md:gap-6"
      >
        <div className="w-full bg-[#0e0e12] border border-border hover:border-muted-foreground transition-all px-3 md:px-4 py-2 rounded-xl flex items-center">
          <YoutubeLogo size={24} color="#ed1313" weight="duotone" />
          <input
            type="text"
            name="videoUrl"
            onChange={e => setIsDisabled(e.target.value.trim() === '')}
            disabled={isLoading}
            className="w-[80%] px-1 ml-1 bg-transparent disabled:cursor-not-allowed outline-0 rounded-md text-foreground placeholder:text-foreground/95 text-sm md:text-base"
            placeholder="Paste a YouTube music link..."
          />

          {isLoading && <CircleNotch size={20} className="animate-spin text-zinc-600 ml-auto" />}
          {isSuccess && <Check size={20} className="text-green-500 ml-auto" weight="bold" />}
          {isError && <X size={20} weight="bold" className="text-red-600 ml-auto" />}
        </div>

        <button
          type="submit"
          disabled={isDisabled || isLoading}
          className="bg-[#0e0e12] border border-border cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:bg-muted transition-all w-10 sm:w-12 h-10 flex items-center justify-center rounded-xl"
        >
          <MagnifyingGlass size={24} color="#efeaea" />
        </button>
      </form>

      <div className="bg-[#0e0e12] border border-border w-full rounded-xl p-4 md:p-5 space-y-4 md:space-y-5">
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
            <Skeleton className="h-5 md:h-6 w-full" />
          </>
        )}

        <div className="flex flex-wrap justify-center gap-x-18 gap-y-2 text-sm md:text-base">
          {isAnalysisFetched ? (
            <>
              <MusicInfoItem label="BPM" value={analysis?.bpm} />

              <Tooltip delayDuration={0}>
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
                <TooltipContent
                  sideOffset={5}
                  align="center"
                  className="p-3 text-sm font-medium bg-background border border-border rounded-lg shadow-lg backdrop-blur-sm bg-opacity-90 text-foreground max-w-[200px]"
                >
                  <p>
                    Alternative Key: <span className="font-bold capitalize">{analysis?.alternativeKey}</span>
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip delayDuration={0}>
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
                <TooltipContent
                  sideOffset={5}
                  align="center"
                  className="p-3 text-sm font-medium bg-background border border-border rounded-lg shadow-lg backdrop-blur-sm bg-opacity-90 text-foreground max-w-[200px]"
                >
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
