export function normalizeYouTubeUrl(url: string): string | null {
  const cleanedUrl = url.trim();

  const videoId = getYouTubeVideoId(cleanedUrl);
  if (!videoId) return null;

  return `https://youtube.com/watch?v=${videoId}`;
}

function getYouTubeVideoId(url: string): string | null {
  const urlWithoutProtocol = url.replace(/^(https?:\/\/)?(www\.)?/, '');

  if (urlWithoutProtocol.startsWith('youtu.be/')) {
    return urlWithoutProtocol.split('/')[1]?.substring(0, 11) || null;
  }

  if (urlWithoutProtocol.includes('youtube.com/watch')) {
    const vParam = new URLSearchParams(urlWithoutProtocol.split('?')[1] || '');
    return vParam.get('v')?.substring(0, 11) || null;
  }

  return null;
}
