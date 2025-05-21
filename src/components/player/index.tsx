"use client";

import { HLS_CONFIG } from "@internals/components/player/constants";
import Hls from "hls.js";
import { useEffect, useRef } from "react";

export default function VideoPlayer({ url }: { url: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const setupHls = (video: HTMLVideoElement) => {
    hlsRef.current = new Hls(HLS_CONFIG);
    hlsRef.current.loadSource(url);
    hlsRef.current.attachMedia(video);
    hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
      // video.play();
    });
  };

  useEffect(() => {
    if (videoRef.current) {
      setupHls(videoRef.current);
    }
  }, [url]);

  return (
    <video className="w-full h-full " controls id="video" ref={videoRef} />
  );
}
