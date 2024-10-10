import { createBot } from "@builderbot/bot";
import { database } from "./database/index.js";
import { provider } from "./provider/index.js";
import { flow } from "./flow/index.js";
import { PORT } from "./config/variables.js";
import { setupRoutes } from "./messageRoutes.js";

const main = async () => {
  const { httpServer, handleCtx } = await createBot(
    {
      flow: flow,
      provider: provider,
      database: database,
    },
    {
      globalState: {
        users: [],
      },
    }
  );

  httpServer(+PORT);

  setupRoutes(provider, handleCtx);
};

main();
