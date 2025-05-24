"use client";

import useDebounceCallback from "@internals/hooks/useDebounceCallback";
import { formatTime } from "@internals/lib/time";
import Image from "next/image";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

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
  const [showControls, setShowControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const debouncedHideControls = useDebounceCallback(
    () => setShowControls(false),
    6000
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      debouncedHideControls();
    };

    const handlePause = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    // Initialiser l'état au montage du composant
    setIsPlaying(!video.paused);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [videoRef, debouncedHideControls]);

  const updateProgressTime = useCallback(() => {
    if (timeRef.current && durationRef.current) {
      timeRef.current.textContent = formatTime(
        videoRef.current?.currentTime || 0
      );
      durationRef.current.textContent = formatTime(
        videoRef.current?.duration - videoRef.current?.currentTime || 0
      );
    }
  }, [videoRef]);

  const handleTimeUpdate = useCallback(() => {
    // Don't update the progress during drag to avoid conflicts
    if (!isDragging && progressFillRef.current) {
      const currentProgress =
        (videoRef.current?.currentTime / videoRef.current?.duration) * 100;
      const progressPercent = isNaN(currentProgress) ? 0 : currentProgress;
      progressFillRef.current.style.width = `${progressPercent}%`;
    }
  }, [isDragging, videoRef]);

  // Update the progress of the video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    handleTimeUpdate();
    updateProgressTime();

    video.addEventListener("timeupdate", () => {
      handleTimeUpdate();
      updateProgressTime();
    });
    return () => {
      video.removeEventListener("timeupdate", () => {
        handleTimeUpdate();
        updateProgressTime();
      });
    };
  }, [videoRef, isDragging, handleTimeUpdate, updateProgressTime]);

  // Initialize the duration when the video is loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      updateProgressTime();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // If the metadata is already loaded
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [videoRef, updateProgressTime]);

  const handleStartDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (!showControls) {
      return;
    }

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
    controlsRef.current?.addEventListener("mousemove", handleMouseMoveDrag);
    controlsRef.current?.addEventListener("mouseup", handleEndDrag);
    controlsRef.current?.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    controlsRef.current?.addEventListener("touchend", handleEndDrag);
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
      controlsRef.current?.removeEventListener(
        "mousemove",
        handleMouseMoveDrag
      );
      controlsRef.current?.removeEventListener("mouseup", handleEndDrag);
      controlsRef.current?.removeEventListener("touchmove", handleTouchMove);
      controlsRef.current?.removeEventListener("touchend", handleEndDrag);
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
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${newProgress}%`;
      }

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

  const isShowing = !isPlaying || showControls || isDragging;

  return (
    <div
      ref={controlsRef}
      className={
        "absolute top-0 left-0 w-full h-full z-50 flex flex-col justify-between transition duration-100"
      }
      onClick={handlePlayPause}
    >
      {isShowing && (
        <div className="w-full h-full">
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
                } transition-opacity pb-4`}
              >
                <div className="flex flex-col items-start justify-left pl-4 pb-4">
                  <h1 className="text-white sm:text-[34px]/[41px] text-[28px]/[34px] font-bold sm:tracking-[-0.4px] tracking-[-0.38px]">
                    {title}
                  </h1>
                  <p className="text-brand-tint-40-opacity-10 font-regular sm:text-[22px]/[28px] text-[28px]/[34px] sm:tracking-[-0.38px] tracking-[-0.26px]">
                    EP.{episodeNumber} / {totalEpisodes}
                  </p>
                </div>
              </div>

              <div
                ref={progressBarRef}
                className={`relative w-full h-1 bg-neutral-tint-50 mb-2 cursor-pointer hover:h-3 transition-all ${
                  isDragging ? "h-3 opacity-100" : "h-1"
                }`}
              >
                <div
                  ref={progressFillRef}
                  className="h-full bg-brand-tint-40"
                  style={{ width: `0%` }}
                />
              </div>

              <div
                className={`flex items-center justify-between px-4 ${
                  isDragging ? "opacity-100" : "opacity-100"
                } transition-opacity`}
              >
                <div
                  ref={timeRef}
                  className="text-white sm:text-[12px]/[16px] text-[11px]/[13px] sm:tracking-[-0px] tracking-[-0.06px]"
                >
                  00:00
                </div>
                <div
                  ref={durationRef}
                  className="text-white sm:text-[12px]/[16px] text-[11px]/[13px] sm:tracking-[-0px] tracking-[-0.06px]"
                  id="duration"
                >
                  00:00
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
