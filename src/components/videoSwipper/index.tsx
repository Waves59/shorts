"use client";

import Player from "@internals/components/player";
import { Series } from "@internals/lib/types";
import { useState } from "react";
import "swiper/css";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

export const VideoSwiper = ({
  series,
  episodeIndex,
}: {
  series: Series;
  episodeIndex: number;
}) => {
  const [isSwiping, setIsSwiping] = useState(false);

  const handleSlideChange = (swiper: SwiperClass) => {
    window.history.pushState(
      null,
      "",
      `/${series.id}/${series.episodes[swiper.activeIndex].id}`
    );
    setTimeout(() => {
      setIsSwiping(false);
    }, 600);
  };

  return (
    <Swiper
      direction="vertical"
      slidesPerView={1}
      spaceBetween={100}
      className="w-full h-full"
      initialSlide={episodeIndex}
      onSliderFirstMove={() => setIsSwiping(true)}
      onSlideChange={handleSlideChange}
    >
      {series.episodes.map((episode, index) => {
        return (
          <SwiperSlide key={episode.id}>
            {({ isActive, isPrev, isNext }) => {
              const loadPriority = isActive
                ? "full"
                : isNext || isPrev
                ? "partial"
                : "none";

              return (
                <Player
                  title={series.title}
                  episodeNumber={index + 1}
                  totalEpisodes={series.episodes.length}
                  url={episode.url}
                  isActive={isActive}
                  loadPriority={loadPriority}
                  isSwiping={isSwiping}
                />
              );
            }}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
