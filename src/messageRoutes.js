import { createArrayMessageDifucion } from "./services/completions/index.js";

export const setupRoutes = (provider, handleCtx) => {
  provider.server.post(
    "/v1/message/send",
    handleCtx(async (bot, req, res) => {
      const { number, message } = req.body;
      await bot.sendMessage(number, message, {});
      return res.end("enviado");
    })
  );

  provider.server.post(
    "/v1/message/sendMedia",
    handleCtx(async (bot, req, res) => {
      const { number, message, media } = req.body;
      await bot.sendMessage(number, message, { media }); // https://i.imgur.com/0HpzsEm.png
      return res.end("enviado");
    })
  );

  //ruta para hacer una difusion con undeleay de 5 segundos
  provider.server.post(
    "/v1/message/difusion",
    handleCtx(async (bot, req, res) => {
      const { message, numbers, media } = req.body;
      const messages = await createArrayMessageDifucion(message);
      for (let i = 0; i < numbers.length; i++) {
        setTimeout(async () => {
          //select a random message
          if (media) {
            await bot.sendMessage(
              numbers[i],
              messages[Math.floor(Math.random() * messages.length)],
              { media }
            );
          } else {
            await bot.sendMessage(
              numbers[i],
              messages[Math.floor(Math.random() * messages.length)],
              {}
            );
          }
        }, i * 5000);
      }
      return res.end("enviado");
    })
  );

  //botstatus
  provider.server.get(
    "/v1/status",
    handleCtx(async (bot, req, res) => {
      if (bot.provider.store.state.connection == "open") {
        console.log("conectado");
        return res.end(bot.provider.vendor.user.id);
      } else {
        console.log("desconectado");
        return res.end("DECONECTADO");
      }
    })
  );
};
