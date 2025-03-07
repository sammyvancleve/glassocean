import { api, HydrateClient } from "~/trpc/server";

import HomePage from "./_components/homePage";

export default async function Home() {
  const models = await api.model.getModelsByCursor({take: 40})
  const loras = await api.model.getLorasByCursor({take: 40})

  return (
    <HydrateClient>
      <HomePage models={models} loras={loras}></HomePage>
    </HydrateClient>
  );
}
