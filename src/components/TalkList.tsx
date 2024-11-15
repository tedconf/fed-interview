import { Fragment, useEffect, useState } from 'react';
import { useVideos } from '../hooks/useVideos';
import type { Video } from '../types/talk';
import { useWindowSize } from '../hooks/useWindowSize';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

interface TalkCardProps {
  video: Video;
}

function TalkCard({ video }: TalkCardProps) {
  const { width, height } = useWindowSize();
  const [cachedImage, setCachedImage] = useState<string | null>(null);

  // Function to get the best matching image based on aspect ratio
  const getBestMatchingImage = () => {
    const ratioMap = {
      '16x9': 16 / 9,
      '4x3': 4 / 3,
      '2x1': 2 / 1,
    };

    if (Array.isArray(video.primaryImageSet)) {
      return video.primaryImageSet.reduce((best, current) => {
        const currentRatio = ratioMap[current.aspectRatioName as keyof typeof ratioMap];
        const bestRatio = ratioMap[best.aspectRatioName as keyof typeof ratioMap];

        return Math.abs(currentRatio - width / height) < Math.abs(bestRatio - width / height)
          ? current
          : best;
      });
    }

    return video.primaryImageSet;
  };

  const backgroundImage = getBestMatchingImage();

  // Function to fetch and cache image
  const fetchAndCacheImage = async (url: string) => {
    try {
      const cached = localStorage.getItem(url);
      if (cached) {
        return cached;
      } else {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            try {
              localStorage.setItem(url, base64data);
            } catch (e) {
              console.warn('LocalStorage is full, unable to cache image:', e);
            }
            resolve(base64data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      return url; // Fallback to original URL
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchAndCacheImage(backgroundImage.url).then((data) => {
      if (isMounted) {
        setCachedImage(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [backgroundImage.url]);

  console.log(video);
  return (
    <div
      style={{
        backgroundImage: `url(${cachedImage || backgroundImage.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
      }}
      className="flex"
    >
      <div className="flex">
        <article className="flex w-full h-full relative bg-blue-500">
          <div className="absolute bottom-0 left-0 text-center bg-gray-800 w-3/5 mx-auto">
            <h3 className="text-5xl break-words pl-0.5">
              {video.title}
            </h3>
          </div>
          <h4 className="text-3xl break-words pl-0.5">
            {video.presenterDisplayName}
          </h4>
          {/* </div> */}
        </article>
        <h5>
          {video.viewedCount < 10000 ? null : (
            video.viewedCount < 1000000 ? (
              `${Math.floor(video.viewedCount / 1000)}K views`
            ) : (
              `${(video.viewedCount / 1000000).toFixed(1)}M views`
            )
          )}
        </h5>
      </div>

    </div>
  );
}

interface TalkListProps {
  searchQuery?: string;
  topicFilter?: string;
}

export function TalkList({ searchQuery, topicFilter }: TalkListProps) {
  const { data, isLoading, error } = useVideos({
    searchQuery,
    topicFilter,
  });

  if (isLoading) {
    return (
      <div role="alert" aria-busy="true" className="loading-state">
        <span className="sr-only">Loading talks...</span>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="error-state">
        <h2>Error Loading Talks</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container relative">
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={'auto'}
        autoplay={{
          delay: 3000,
          disableOnInteraction: true,
        }}
      >
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.videos.edges.map(({ node }) => (
              <SwiperSlide key={node.id}>
                <TalkCard video={node} />
              </SwiperSlide>
            ))}
          </Fragment>
        ))}
      </Swiper>
    </div>
  );
}