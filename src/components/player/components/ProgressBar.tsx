"use client";

import { ProgressBarProps } from "@internals/components/player/types";
import { formatTime } from "@internals/lib/time";
import { useCallback, useEffect, useRef } from "react";

export default function ProgressBar({
  videoRef,
  isDragging,
  setIsDragging,
}: ProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);

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

    const handleTimeUpdateEvent = () => {
      handleTimeUpdate();
      updateProgressTime();
    };

    handleTimeUpdate();
    updateProgressTime();

    video.addEventListener("timeupdate", handleTimeUpdateEvent);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdateEvent);
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
  };

  // Handle mouse move during drag
  const handleMouseMoveDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && progressBarRef.current && videoRef.current) {
      e.preventDefault();
      updateProgressFromEvent(e.clientX);
    }
  };

  // Handle touch move during drag
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (
      isDragging &&
      progressBarRef.current &&
      videoRef.current &&
      e.touches.length > 0
    ) {
      updateProgressFromEvent(e.touches[0].clientX);
    }
  };

  // End drag
  const handleEndDrag = () => {
    if (isDragging) {
      // Use requestAnimationFrame to avoid lag
      requestAnimationFrame(() => {
        videoRef.current.play();
      });

      setIsDragging(false);
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

      // Use requestAnimationFrame to avoid lag
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = position * videoRef.current.duration;
        }
      });
    }
  };

  return (
    <div
      className={`pointer-events-auto pt-2 ${isDragging ? "opacity-100" : ""}`}
      onMouseDown={handleStartDrag}
      onTouchStart={handleStartDrag}
      onMouseMove={handleMouseMoveDrag}
      onTouchMove={handleTouchMove}
      onMouseUpCapture={handleEndDrag}
      onTouchEnd={handleEndDrag}
    >
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
  );
}
