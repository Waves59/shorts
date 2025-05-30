"use client";

import { Button } from "@internals/components/ui/button";
import { Icon } from "@internals/components/ui/icon";
import useDebounceCallback from "@internals/hooks/useDebounceCallback";
import { RefObject, useEffect, useRef, useState } from "react";
import { useSwiper } from "swiper/react";
import ProgressBar from "./ProgressBar";

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
  const controlsRef = useRef<HTMLDivElement>(null);
  const { animating, isBeginning, isEnd, slidePrev, slideNext } = useSwiper();

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

    // Initialize state on component mount
    setIsPlaying(!video.paused);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [videoRef, debouncedHideControls]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    // Use requestAnimationFrame to optimize state changes
    requestAnimationFrame(() => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  };

  const isShowing = animating
    ? false
    : !isPlaying || showControls || isDragging;

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
            <div className="flex items-center justify-between  sm:visible invisible">
              {/* Previous Episode */}
              {!isBeginning && (
                <div className="flex items-center justify-start mr-auto">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      slidePrev();
                    }}
                    className="text-white hover:text-brand-tint-40"
                  >
                    <Icon name="arrow-left" size={32} />
                    Previous Episode
                  </Button>
                </div>
              )}
              {/* Next Episode */}
              {!isEnd && (
                <div className="flex items-center justify-end ml-auto">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      slideNext();
                    }}
                    className="text-white hover:text-brand-tint-40"
                  >
                    Next Episode
                    <Icon name="arrow-right" size={32} />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-1 flex items-center justify-center">
              <Button
                variant="icon"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                className={
                  "pointer-events-auto w-40 h-40 flex items-center justify-center"
                }
              >
                <Icon name={isPlaying ? "pause" : "play"} size={40} />
              </Button>
            </div>

            <div className="pointer-events-auto">
              <div
                className={`flex items-center justify-between ${
                  isDragging ? "opacity-0" : "opacity-100"
                } transition-opacity pb-4`}
              >
                <div className="flex flex-col items-start justify-left pl-4">
                  <h1 className="text-white sm:text-[28px]/[34px] text-[22px]/[28px] font-bold sm:tracking-[-0.38px] tracking-[-0.26px]">
                    {title}
                  </h1>
                  <p className="text-brand-tint-40-opacity-10 font-regular sm:text-[16px]/[20px] text-[14xpx]/[18px] sm:tracking-[-0.26px] tracking-[-0.22px]">
                    EP.{episodeNumber} / {totalEpisodes}
                  </p>
                </div>
              </div>

              <ProgressBar
                videoRef={videoRef}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
