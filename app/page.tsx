import ComingSoon from "@/components/ComingSoon";

export const dynamic = "force-dynamic";

export default function HomePage() {
  // EdgeStore public URLs for coming soon assets
  const webBannerUrl = "https://files.edgestore.dev/ylanf3daiol6idma/comingsoon/_public/web%20banner.mp4";
  const mobileVideoUrl = "https://files.edgestore.dev/ylanf3daiol6idma/comingsoon/_public/mobile%20(1).mp4";
  const desktopAnimationUrl = "https://files.edgestore.dev/ylanf3daiol6idma/comingsoon/_public/animation.json";
  const mobileAnimationUrl = "https://files.edgestore.dev/ylanf3daiol6idma/comingsoon/_public/mobile.json";

  return (
    <ComingSoon
      webBannerUrl={webBannerUrl}
      mobileVideoUrl={mobileVideoUrl}
      desktopAnimationUrl={desktopAnimationUrl}
      mobileAnimationUrl={mobileAnimationUrl}
    />
  );
}