const HeroBackgroundVideo = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute left-1/2 top-1/2 min-h-full min-w-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        poster=""
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(213,52%,12%)]/95 via-[hsl(213,52%,12%)]/82 to-[hsl(213,52%,12%)]/68" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(213,52%,12%)]/72 via-[hsl(213,52%,12%)]/16 to-transparent" />
    </div>
  );
};

export default HeroBackgroundVideo;
