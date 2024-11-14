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
      }}
      className="relative"
    >
      {/* <article className="h-screen bottom-0 left-0 overflow-auto bg-white/80 backdrop-blur-sm">
        <h3 style={{ marginTop: '0px' }} className="h-screen text-bottom">
          {video.title}
        </h3>
        <p className="">{video.presenterDisplayName}</p>
        <div className="">
          {Math.floor(video.duration / 60)} minutes •{' '}
          {new Intl.NumberFormat().format(video.viewedCount)} views
        </div>
      </article> */}

      <article className="w-full h-full" style={{ height: "100%"}}>
        <h3 style={{ marginTop: '0px', position: "absolute", bottom: "3em", left: "2em", fontSize: "5em"}} className="">
          {video.title}
        </h3>
        <p style={{ marginTop: '0px', position: "absolute", bottom: "6em", left: "5em", fontSize: "2em"}}>{video.presenterDisplayName}</p>
      </article>
      <div style={{ position: "absolute", bottom: "7em", left: "6.5em", paddingLeft: "8px", fontSize: "1.5em"}}>
        {video.viewedCount < 10000 ? null : (
          video.viewedCount < 1000000 ? (
            `${Math.floor(video.viewedCount / 1000)}K views`
          ) : (
            `${(video.viewedCount / 1000000).toFixed(1)}M views`
          )
        )}
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
    <div>
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