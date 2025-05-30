"use client";

import { subscribeToPremium } from "@internals/app/actions/subscription";
import Paywall from "@internals/components/paywall";
import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { LoadingIcon } from "@internals/components/ui/icon";
import { Series } from "@internals/lib/types";
import "swiper/css";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

// Lazy load Player component because heavy component
const Player = lazy(() => import("@internals/components/player"));

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
  const swiperRef = useRef<SwiperClass | null>(null);

  // Check if current episode should show paywall
  useEffect(() => {
    const currentEpisode = series.episodes[currentEpisodeIndex];
    const shouldShow = !isPremium && currentEpisode?.premium;
    setShowPaywall(shouldShow);
  }, [currentEpisodeIndex, isPremium, series.episodes]);

  const handleSlideChange = (swiper: SwiperClass) => {
    // Save previous index before changing
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

  const handleClosePaywall = () => {
    setShowPaywall(false);
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
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
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
                  <Suspense
                    fallback={
                      <div className="w-full h-full bg-neutral-tint-70 flex items-center justify-center">
                        <LoadingIcon
                          size={40}
                          className="w-10 h-10 animate-spin"
                        />
                      </div>
                    }
                  >
                    <div className="animate-fadeIn opacity-0 w-full h-full">
                      <Player
                        title={series.title}
                        episodeNumber={index + 1}
                        totalEpisodes={series.episodes.length}
                        url={episode.url}
                        isActive={isActive}
                        loadPriority={loadPriority}
                      />
                    </div>
                  </Suspense>
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
          onClose={handleClosePaywall}
          onSubscribe={handleSubscribe}
          isLoading={isPending}
        />
      )}
    </>
  );
};
