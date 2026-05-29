"use client";

import { useEffect, useRef } from "react";
import {
  loadYoutubeIframeApi,
  type YoutubeIframePlayer,
} from "@/shared/lib/youtube/iframe-api";
import styles from "./SongDetailView.module.scss";

export function SongYoutubePlayer({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YoutubeIframePlayer | null>(null);

  useEffect(() => {
    let cancelled = false;

    void loadYoutubeIframeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT) {
        return;
      }

      playerRef.current?.destroy();

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange(event) {
            if (event.data !== window.YT?.PlayerState.ENDED) {
              return;
            }

            const player = playerRef.current;
            player?.seekTo(0, true);
            player?.pauseVideo();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  return (
    <div
      ref={containerRef}
      className={styles.player}
      aria-label={title}
    />
  );
}
