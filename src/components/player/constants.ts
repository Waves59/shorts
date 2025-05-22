export const HLS_CONFIG = {
  autoStartLoad: false,
  maxBufferLength: 10, // Buffer maximum in seconds
  maxMaxBufferLength: 20, // Buffer maximum absolute
  fragLoadingTimeOut: 8000, // Fragment loading timeout (8s)
  manifestLoadingTimeOut: 8000, // Manifest loading timeout (8s)
  levelLoadingTimeOut: 8000, // Level loading timeout (8s)
  startLevel: 0, // Start at the lowest quality for a quick start
  startPosition: 0, // Start at the beginning of the video
  debug: false, // Disable debug logs in production
  progressive: true, // Allow progressive downloads
  lowLatencyMode: true, // Disable low latency mode (not necessary for pre-recorded videos)
  backBufferLength: 10, // Keep only 10 seconds of buffer past for memory savings
  enableWorker: true, // Enable the web worker for better performance
  abrEwmaFastLive: 3.0, // React more quickly to changes in bandwidth
  abrEwmaSlowLive: 9.0,
  testBandwidth: true, // Test bandwidth from the beginning
};
