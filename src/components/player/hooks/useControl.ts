import useDebounceCallback from "@internals/hooks/useDebounceCallback";

const useControl = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const optimizedPlay = useDebounceCallback(() => {
    if (!videoRef.current) return;

    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play();
    }
  }, 50);

  const optimizedPause = useDebounceCallback(() => {
    if (!videoRef.current) return;

    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, 50);

  const resetVideo = useDebounceCallback(() => {
    if (!videoRef.current) return;

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, 50);
  return {
    optimizedPlay,
    optimizedPause,
    resetVideo,
  };
};

export default useControl;
