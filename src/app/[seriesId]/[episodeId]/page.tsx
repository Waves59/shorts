"use server";

import { VideoSwiper } from "@internals/components/videoSwipper";
import { Episode, Series } from "@internals/lib/types";
import { SERIES } from "@internals/mockups/series";
import { cookies } from "next/headers";

export default async function Page({
  params,
}: {
  params: Promise<{ seriesId: string; episodeId: string }>;
}) {
  const { seriesId, episodeId } = await params;

  const cookieStore = await cookies();
  const isPremium = cookieStore.get("premium")?.value === "true";

  // Use full data and filter for non-premium users
  const filteredSeries = isPremium
    ? SERIES
    : SERIES.map((series) => ({
        ...series,
        episodes: series.episodes.map((episode) => ({
          ...episode,
          // Protect url for non premium users
          url: episode.premium ? "" : episode.url,
        })),
      }));

  const series = filteredSeries.find(
    (series: Series) => series.id === seriesId
  );
  const episode = series?.episodes.find(
    (episode: Episode) => episode.id === episodeId
  );
  const episodeIndex =
    series?.episodes.findIndex(
      (episode: Episode) => episode.id === episodeId
    ) || 0;

  if (!episode || !series) {
    return <div>Episode not found</div>;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VideoSwiper
        series={series}
        episodeIndex={episodeIndex}
        isPremium={isPremium}
      />
    </div>
  );
}
