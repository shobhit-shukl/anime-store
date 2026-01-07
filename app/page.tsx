import { getHomeContent } from "@/app/actions/anime";
import HomeClient from "@/components/home/HomeClient";

export const dynamic = "force-dynamic"; // Ensure fresh data on each visit (or use revalidate)

export default async function HomePage() {
  const { movies, webseries } = await getHomeContent();

  return (
    <HomeClient
      initialMovies={movies}
      initialWebseries={webseries}
    />
  );
}