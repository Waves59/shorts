"use client";

import { HLS_CONFIG } from "@internals/components/player/constants";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import CustomControls from "./CustomControls";

export default function VideoPlayer({
  title,
  episodeNumber,
  totalEpisodes,
  url,
  isActive,
  loadPriority = "full",
  isSwiping = false,
}: {
  title: string;
  episodeNumber: number;
  totalEpisodes: number;
  url: string;
  isActive: boolean;
  loadPriority?: "full" | "partial" | "none";
  isSwiping?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const setupHls = (video: HTMLVideoElement) => {
      if (hlsRef.current) {
        if (hlsRef.current.url !== url) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        } else {
          return;
        }
      }

      if (loadPriority === "none") {
        return;
      }

      const config = { ...HLS_CONFIG };

      if (loadPriority === "partial") {
        config.maxBufferLength = 10;
        config.maxMaxBufferLength = 20;
        config.autoStartLoad = true;
      }

      if (loadPriority === "full") {
        config.startLevel = 0;
        config.manifestLoadingTimeOut = 10000;
        config.fragLoadingTimeOut = 10000;
        config.autoStartLoad = true;
      }

      const handlePlay = () => {
        if (isActive && video) {
          video.currentTime = 0;
          video.play();
        }
      };

      hlsRef.current = new Hls(config);
      hlsRef.current.loadSource(url);
      hlsRef.current.attachMedia(video);

      hlsRef.current.on(Hls.Events.MEDIA_ATTACHED, () => {
        if (loadPriority === "full" && hlsRef.current) {
          hlsRef.current.startLoad();
        }
      });

      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoaded(true);

        if (loadPriority === "full") {
          if (isActive && video) {
            handlePlay();
          }
        }
      });
    };

    const video = videoRef.current;
    if (!video || (loadPriority !== "full" && loadPriority !== "partial"))
      return;

    if (loadPriority === "full" || loadPriority === "partial") {
      if (!hlsRef.current) {
        setupHls(video);
      }
    }
  }, [url, loadPriority, isActive]);

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
        setIsLoaded(false);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLoaded || loadPriority === "none") return;

    if (isActive && loadPriority === "full") {
      video.play();
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive, isLoaded, loadPriority]);

  const handleVideoClick = () => {
    if (videoRef.current?.paused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  };

  const showControls = videoRef.current && !isSwiping && isActive;

  return (
    <div className="w-full h-dvh relative overflow-hidden">
      <video
        className="w-full h-full relative object-cover sm:object-contain "
        id="video"
        ref={videoRef}
        onClick={handleVideoClick}
        playsInline
        autoPlay={isActive && loadPriority === "full"}
        preload={loadPriority === "none" ? "none" : "auto"}
      />
      {showControls && (
        <CustomControls
          title={title}
          episodeNumber={episodeNumber}
          totalEpisodes={totalEpisodes}
          videoRef={videoRef as React.RefObject<HTMLVideoElement>}
        />
      )}
    </div>
  );
}
