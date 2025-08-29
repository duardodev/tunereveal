export function normalizeYouTubeUrl(url: string): string | null {
  const cleanedUrl = url.trim();

  const videoId = getYouTubeVideoId(cleanedUrl);
  if (!videoId) return null;

  return `https://youtube.com/watch?v=${videoId}`;
}

export function getYouTubeVideoId(url: string): string | null {
  const urlWithoutProtocol = url.replace(/^(https?:\/\/)?(www\.)?/, '');

  if (urlWithoutProtocol.startsWith('youtu.be/')) {
    const id = urlWithoutProtocol.split('/')[1].split('?')[0];
    return id && id.length === 11 ? id : null;
  }

  if (urlWithoutProtocol.includes('youtube.com/watch')) {
    const vParam = new URLSearchParams(urlWithoutProtocol.split('?')[1] || '');
    const id = vParam.get('v');
    return id && id.length === 11 ? id : null;
  }

  return null;
}
