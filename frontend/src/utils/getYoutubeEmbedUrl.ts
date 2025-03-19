/**
 * Helper function to convert a YouTube URL to its embed URL.
 * @param url - The regular YouTube video URL.
 * @returns - The corresponding embed URL for the video.
 */
export function getYoutubeEmbedUrl(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/); // Regex to extract the video ID
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url; // If it's not a YouTube URL, return the original URL.
}
