import { createBot } from "@builderbot/bot";
import { database } from "./database/index.js";
import { provider } from "./provider/index.js";
import { flow } from "./flow/index.js";
import { PORT } from "./config/variables.js";
import { setupRoutes } from "./messageRoutes.js";

import { actualizar_estado } from "./api/funciones.js";

/**
  Limites de uso de la api se asistentes
  - 200,000 Tokens por minutos
  - 500 Peticiones por minuto 
  - 10,000 Peticiones por dia 
  - 2,000,000 Tokens por dia 
  **/
const main = async () => {
  const bot = await createBot(
    {
      flow: flow,
      provider: provider,
      database: database,
    },
    {
      globalState: {
        users: [],
      },
      queue: {
        timeout: 20000,
        concurrencyLimit: 50,
      }
    }
  );

  const { httpServer, handleCtx } = bot;

  httpServer(+PORT);

  setupRoutes(provider, handleCtx);

  provider.on("ready", () => {
    actualizar_estado({ botStatus: "ready" });
  });

  provider.on('require_action', async () => {
    actualizar_estado({ botStatus: "require_action" });
  })

  provider.on('auth_failure', async () => {
    actualizar_estado({ botStatus: "auth_failure" });
  })
};

main();