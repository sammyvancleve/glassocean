import { api, HydrateClient } from "~/trpc/server";

import HomePage from "./_components/homePage";

export default async function Home() {
  const apiResult = await api.image.getLatestImagesByCursor({take: 40})

  return (
    <HydrateClient>
      <HomePage images={apiResult.images}></HomePage>
    </HydrateClient>
  );
}
