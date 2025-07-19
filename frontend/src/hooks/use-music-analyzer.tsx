import { useMutation } from '@tanstack/react-query';

interface AnalysisData {
  bpm: number;
  key: string;
  camelot: string;
  loudness: number;
  timeSignature: string;
  alternativeKey: string;
  alternativeCamelot: string;
}

export function useMusicAnalyzer() {
  const {
    mutateAsync: fetchMetadata,
    data: metadata,
    isPending: isFetchingMetadata,
    isSuccess: isMetadataFetched,
    isError: isMetadataFetchError,
  } = useMutation({
    mutationFn: async (videoUrl: string) => {
      const response = await fetch(`https://noembed.com/embed?url=${videoUrl}`);
      const data = await response.json();
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

      if (response.status === 429) {
        const errorData = await response.json();
        throw new Error(errorData.error, { cause: errorData });
      }

      const data = await response.json();
      return data as AnalysisData;
    },
  });

  const isLoading = isFetchingMetadata || isFetchingAnalysis;
  const isSuccess = isMetadataFetched && isAnalysisFetched;
  const isError = isMetadataFetchError || isAnalysisFetchError;

  return {
    fetchMetadata,
    fetchAnalysis,
    metadata,
    analysis,
    isLoading,
    isSuccess,
    isError,
    isAnalysisFetched,
    isMetadataFetched,
  };
}
