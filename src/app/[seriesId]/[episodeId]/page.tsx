"use server";

import Player from "@internals/components/player";
import { SERIES } from "@internals/mockups/series";

export default async function Page({
  params,
}: {
  params: { seriesId: string; episodeId: string };
}) {
  const { seriesId, episodeId } = await params;
  const series = SERIES.find((series) => series.id === seriesId);
  const episode = series?.episodes.find((episode) => episode.id === episodeId);

  if (!episode || !series) {
    return <div>Episode not found</div>;
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="w-full h-full">
        <Player url={episode.url} poster={episode.poster} />
      </div>
    </div>
  );
}
