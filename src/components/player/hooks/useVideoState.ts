import useDebounceCallback from "@internals/hooks/useDebounceCallback";

export const useVideoState = (
  videoRef: React.RefObject<HTMLVideoElement | null>
) => {
  const optimizedPlay = useDebounceCallback(() => {
    if (!videoRef.current) return;

    requestAnimationFrame(() => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play();
      }
    });
  }, 50); // 50ms delay to avoid multiple calls

  const optimizedPause = useDebounceCallback(() => {
    if (!videoRef.current) return;

    requestAnimationFrame(() => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    });
  }, 50);

  const resetVideo = useDebounceCallback(() => {
    if (!videoRef.current) return;

    requestAnimationFrame(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    });
  }, 50);

  return {
    optimizedPlay,
    optimizedPause,
    resetVideo,
  };
};
