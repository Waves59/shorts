export const HLS_CONFIG = {
  maxBufferLength: 30, // Buffer maximum in seconds
  maxMaxBufferLength: 60, // Buffer maximum absolute
  fragLoadingTimeOut: 20000, // Timeout of fragment loading (20s)
  manifestLoadingTimeOut: 20000, // Timeout of manifest loading
  levelLoadingTimeOut: 20000, // Timeout of level loading
  startLevel: -1, // Auto-selection of level based on bandwidth
  startPosition: 0, // Start at the beginning of the video
  debug: false, // Disable debug logs in production
  progressive: true, // Allow progressive downloads
  lowLatencyMode: false, // Disable low latency mode (not needed for pre-recorded videos)
  backBufferLength: 30, // Keep 30 seconds of buffer in the past
  enableWorker: true, // Enable the web worker for better performance
};
