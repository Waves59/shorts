"use client";

import Image from "next/image";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";

interface CustomControlsProps {
  title: string;
  episodeNumber: number;
  totalEpisodes: number;
  videoRef: RefObject<HTMLVideoElement>;
}

export default function CustomControls({
  title,
  episodeNumber,
  totalEpisodes,
  videoRef,
}: CustomControlsProps) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const isPlaying = useMemo(() => {
    return !videoRef.current?.paused;
  }, [videoRef.current?.paused]);

  // Initialize the duration when the video is loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // If the metadata is already loaded
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setTimeout(() => {
        setShowControls(false);
      }, 500);
    };

    const handlePause = () => {
      setShowControls(true);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [videoRef]);

  // Update the progress of the video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Don't update the progress during drag to avoid conflicts
      if (!isDragging) {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(isNaN(currentProgress) ? 0 : currentProgress);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoRef, isDragging]);

  // Handle the automatic display/hide of controls
  useEffect(() => {
    // Function to handle the display/hide of controls
    const resetControlsTimer = () => {
      // Cancel the previous timer if it exists
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
        hideControlsTimerRef.current = null;
      }

      // Show controls
      setShowControls(true);

      // Configure a new timer to hide the controls
      if (!videoRef.current?.paused && !isDragging) {
        hideControlsTimerRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleDocumentMouseMove = () => {
      resetControlsTimer();
    };

    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("touchstart", handleDocumentMouseMove, {
      passive: true,
    });

    return () => {
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("touchstart", handleDocumentMouseMove);

      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, [isPlaying, isDragging]);

  const handleStartDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    // Pause during drag
    if (!videoRef.current.paused) {
      videoRef.current.pause();
    }

    setIsDragging(true);

    // Update progress immediately
    if ("touches" in e && e.touches.length > 0) {
      updateProgressFromEvent(e.touches[0].clientX);
    } else if ("clientX" in e) {
      updateProgressFromEvent(e.clientX);
    }

    // Handle mouse move and end drag globally
    document.addEventListener("mousemove", handleMouseMoveDrag);
    document.addEventListener("mouseup", handleEndDrag);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleEndDrag);
  };

  // Handle mouse move during drag
  const handleMouseMoveDrag = (e: MouseEvent) => {
    if (isDragging && progressBarRef.current && videoRef.current) {
      e.preventDefault();
      updateProgressFromEvent(e.clientX);
    }
  };

  // Handle touch move during drag
  const handleTouchMove = (e: TouchEvent) => {
    if (
      isDragging &&
      progressBarRef.current &&
      videoRef.current &&
      e.touches.length > 0
    ) {
      e.preventDefault();
      updateProgressFromEvent(e.touches[0].clientX);
    }
  };

  // End drag
  const handleEndDrag = (e: MouseEvent | TouchEvent) => {
    if (isDragging) {
      e.stopPropagation();

      videoRef.current.play();

      setIsDragging(false);

      // Clean up events
      document.removeEventListener("mousemove", handleMouseMoveDrag);
      document.removeEventListener("mouseup", handleEndDrag);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEndDrag);
    }
  };

  // Function to update the progress from the cursor position
  const updateProgressFromEvent = (clientX: number) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      let position = (clientX - rect.left) / rect.width;

      // Limit position between 0 and 1
      position = Math.max(0, Math.min(1, position));

      const newProgress = position * 100;
      setProgress(newProgress);

      // Update video current time
      videoRef.current.currentTime = position * videoRef.current.duration;
    }
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      e.stopPropagation();
      updateProgressFromEvent(e.clientX);
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      ref={controlsRef}
      className={`absolute top-0 left-0 w-full h-full z-50 flex flex-col justify-between transition duration-100 ${
        !isPlaying || showControls || isDragging ? "opacity-100" : "opacity-0"
      }`}
      onClick={handlePlayPause}
    >
      {/* Overlay black */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-tint-70/80 via-transparent to-neutral-tint-50/30" />

      {/* Controls */}
      <div className="relative w-full h-full flex flex-col justify-between py-6">
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
            className={
              "pointer-events-auto w-40 h-40 flex items-center justify-center"
            }
          >
            {isPlaying ? (
              <Image width={40} height={40} src="/pause.svg" alt="pause" />
            ) : (
              <Image width={40} height={40} src="/play.svg" alt="play" />
            )}
          </button>
        </div>

        <div
          className={`pointer-events-auto pt-8 ${
            isDragging ? "opacity-100" : ""
          }`}
          onClick={handleProgressBarClick}
          onMouseDown={handleStartDrag}
          onTouchStart={handleStartDrag}
        >
          <div
            className={`flex items-center justify-between ${
              isDragging ? "opacity-0" : "opacity-100"
            } transition-opacity`}
          >
            <div className="flex flex-col items-start justify-left pl-4 pb-4">
              <h1 className="text-white text-xl font-bold">{title}</h1>
              <p className="text-white text-sm font-medium">
                EP.{episodeNumber} / {totalEpisodes}
              </p>
            </div>
          </div>

          <div
            ref={progressBarRef}
            className={`relative w-full h-1 bg-neutral-tint-50 mb-4 cursor-pointer hover:h-3 transition-all ${
              isDragging ? "h-3 opacity-100" : "h-1"
            }`}
          >
            <div
              className="h-full bg-brand-tint-40"
              style={{ width: `${progress}%` }}
            />

            {isDragging && (
              <div
                className="absolute bottom-full mb-2 px-2 py-1 rounded bg-neutral-tint-70 text-white text-xs font-medium transform -translate-x-1/2"
                style={{ left: `${progress}%` }}
              >
                {formatTime(videoRef.current?.currentTime || 0)}
              </div>
            )}
          </div>

          <div
            className={`flex items-center justify-between px-4 ${
              isDragging ? "opacity-0" : "opacity-100"
            } transition-opacity`}
          >
            <div className="text-white text-sm font-medium">
              {formatTime(videoRef.current?.currentTime || 0)}
            </div>
            <div className="text-white text-sm font-medium">
              {formatTime(duration - videoRef.current?.currentTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
