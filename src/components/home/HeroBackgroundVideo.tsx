const YOUTUBE_VIDEO_ID = "ovK4Ik3HIJI";

const HeroBackgroundVideo = () => {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&playsinline=1&rel=0`;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 scale-[1.35] sm:scale-[1.2] md:scale-[1.08] origin-center">
        <iframe
          title="Ikamba Media background reel"
          src={embedUrl}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(213,52%,12%)]/95 via-[hsl(213,52%,12%)]/82 to-[hsl(213,52%,12%)]/68" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(213,52%,12%)]/72 via-[hsl(213,52%,12%)]/16 to-transparent" />
    </div>
  );
};

export default HeroBackgroundVideo;