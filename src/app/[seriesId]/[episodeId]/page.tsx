"use server";

import { VideoSwiper } from "@internals/components/videoSwipper";
import { SERIES } from "@internals/mockups/series";

export default async function Page({
  params,
}: {
  params: Promise<{ seriesId: string; episodeId: string }>;
}) {
  const { seriesId, episodeId } = await params;
  const series = SERIES.find((series) => series.id === seriesId);
  const episode = series?.episodes.find((episode) => episode.id === episodeId);
  const episodeIndex =
    series?.episodes.findIndex((episode) => episode.id === episodeId) || 0;

  if (!episode || !series) {
    return <div>Episode not found</div>;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VideoSwiper series={series} episodeIndex={episodeIndex} />
    </div>
  );
}
