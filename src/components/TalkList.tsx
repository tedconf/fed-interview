import { Fragment } from 'react';
import { useVideos } from '../hooks/useVideos';
import type { Video } from '../types/talk';
import { useWindowSize } from '../hooks/useWindowSize';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';
// import { EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';


interface TalkCardProps {
  video: Video;
}

function TalkCard({ video }: TalkCardProps) {
  const { width, height } = useWindowSize();
  
  // Find best matching image based on aspect ratio
  const getBestMatchingImage = () => {
    const ratioMap = {
      '16x9': 16/9,
      '4x3': 4/3,
      '2x1': 2/1
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
  
  return (
    <div 
      style={{ 
        backgroundImage: `url(${backgroundImage.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: `${width}px`,
        height: `${height}px`,
      }} 
      className="fixed inset-0"
    >
      <article className="v-full h-full overflow-auto bg-white/80 backdrop-blur-sm">
        {/* <img
          src={video.primaryImageSet.url}
          alt={video.title}
          className="w-full h-48 object-cover rounded"
          loading="lazy"
        /> */}
        <h3 style={{marginTop: "0px"}} className="h-full text-bottom">{video.title}</h3>
        <p className="">{video.presenterDisplayName}</p>
        <div className="">
          {Math.floor(video.duration / 60)} minutes • {new Intl.NumberFormat().format(video.viewedCount)} views
        </div>
      </article>
    </div>
  );
}

interface TalkListProps {
  searchQuery?: string;
  topicFilter?: string;
}

export function TalkList({ searchQuery, topicFilter }: TalkListProps) {
  const {
    data,
    isLoading,
    error
  } = useVideos({
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
        slidesPerView={"auto"}
        effect="fade"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
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

      {/* {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load more'}
        </button>
      )} */}
    </div>
  );
}