import { createBot } from "@builderbot/bot";
import { database } from "./database/index.js";
import { provider } from "./provider/index.js";
import { flow } from "./flow/index.js";
import { PORT } from "./config/variables.js";
import { setupRoutes } from "./messageRoutes.js";
import fs from "fs/promises"
import { chatwoot, queue } from "./services/config.js";
import { handlerMessage } from "./services/chatwood/index.js";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import mimeType from "mime-types";

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

  provider.on("message", (payload) => {
    queue.enqueue(async () => {
      try {
        const attachment = [];
        if (payload?.body.includes("_event_")) {
          const mime =
            payload?.message?.imageMessage?.mimetype ??
            payload?.message?.videoMessage?.mimetype ??
            payload?.message?.documentMessage?.mimetype;
          const extension = mimeType.extension(mime);
          const buffer = await downloadMediaMessage(payload, "buffer");
          const fileName = `file-${Date.now()}.${extension}`;
          const pathFile = `${process.cwd()}/public/${fileName}`;
          await fs.writeFile(pathFile, buffer);
          console.log(`[FICHERO CREADO] http://localhost:${PORT}/${fileName}`);
          attachment.push(pathFile);
        }
        await handlerMessage(
          {
            phone: payload.from,
            name: payload.pushName,
            message: payload.body,
            attachment,
            mode: "incoming",
          },
          chatwoot
        );
      } catch (err) {
        console.log("ERROR", err);
      }
    });
  });

  //Los mensajes salientes (cuando el bot le envia un mensaje al cliente)
  bot.on("send_message", (payload) => {
    queue.enqueue(async () => {
      await handlerMessage(
        {
          phone: payload.from,
          name: payload.pushName || "",
          message: payload.answer,
          mode: "outgoing",
        },
        chatwoot
      );
    });
  });
};

main();