"use client";

import { subscribeToPremium } from "@internals/app/actions/subscription";
import Paywall from "@internals/components/paywall";
import Player from "@internals/components/player";
import { Series } from "@internals/lib/types";
import { useEffect, useState, useTransition } from "react";
import "swiper/css";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

export const VideoSwiper = ({
  series,
  episodeIndex,
  isPremium,
  onPremiumUpdate,
}: {
  series: Series;
  episodeIndex: number;
  isPremium: boolean;
  onPremiumUpdate?: (isPremium: boolean) => void;
}) => {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(episodeIndex);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Check if current episode should show paywall
  useEffect(() => {
    const currentEpisode = series.episodes[currentEpisodeIndex];
    const shouldShow = !isPremium && currentEpisode?.premium;
    setShowPaywall(shouldShow);
  }, [currentEpisodeIndex, isPremium, series.episodes]);

  const handleSlideChange = (swiper: SwiperClass) => {
    setCurrentEpisodeIndex(swiper.activeIndex);
    if (series) {
      window.history.pushState(
        null,
        "",
        `/${series.id}/${series.episodes[swiper.activeIndex].id}`
      );
    }
  };

  const handleSubscribe = () => {
    startTransition(async () => {
      try {
        const result = await subscribeToPremium();

        if (result.success) {
          // Close paywall
          setShowPaywall(false);

          // Update parent component state if callback provided
          if (onPremiumUpdate) {
            onPremiumUpdate(true);
          } else {
            // Fallback: reload page to refresh premium status from server
            window.location.reload();
          }
        } else {
          console.error("Subscription failed:", result.message);
        }
      } catch (error) {
        console.error("Subscription error:", error);
      }
    });
  };

  return (
    <>
      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={100}
        touchStartPreventDefault={false}
        className="w-full h-full"
        initialSlide={episodeIndex}
        onTouchEnd={handleSlideChange}
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
                  />
                );
              }}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Paywall rendered outside of Swiper to avoid z-index conflicts */}
      {showPaywall && (
        <Paywall
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          onSubscribe={handleSubscribe}
          isLoading={isPending}
        />
      )}
    </>
  );
};
