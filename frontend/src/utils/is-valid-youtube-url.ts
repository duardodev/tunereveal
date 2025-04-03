export function isValidYouTubeUrl(url: string) {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\?.*)?$/;
  return regex.test(url);
}
