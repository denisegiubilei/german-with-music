declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        config: {
          videoId: string;
          width?: string | number;
          height?: string | number;
          playerVars?: Record<string, string | number>;
          events?: {
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => YoutubeIframePlayer;
      PlayerState: {
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export type YoutubeIframePlayer = {
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  pauseVideo(): void;
  destroy(): void;
};

const IFRAME_API_SRC = "https://www.youtube.com/iframe_api";

let iframeApiReady: Promise<void> | null = null;

/** Loads the YouTube IFrame Player API once per page. */
export function loadYoutubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (!iframeApiReady) {
    iframeApiReady = new Promise((resolve) => {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        resolve();
      };

      if (!document.querySelector(`script[src="${IFRAME_API_SRC}"]`)) {
        const tag = document.createElement("script");
        tag.src = IFRAME_API_SRC;
        tag.async = true;
        document.head.appendChild(tag);
      }
    });
  }

  return iframeApiReady;
}
