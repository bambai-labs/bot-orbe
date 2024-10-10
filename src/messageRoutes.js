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

  //chatwood hooks
  provider.server.post(
    "/v1/chatwood",
    handleCtx(async (bot, req, res) => {
      const body = req.body;
      const attachments = body?.attachments;
      try {
        const mapperAttributes = body?.changed_attributes
          ?.map((a) => Object.keys(a))
          .flat(2);

        /**
         * Esta funcion se encarga de agregar o remover el numero a la blacklist
         * eso quiere decir que podemos hacer que el chatbot responda o no
         * para que nos sirve, para evitar que el chatbot responda mientras
         * un agente humano esta escribiendo desde chatwoot
         */
        if (
          body?.event === "conversation_updated" &&
          mapperAttributes.includes("assignee_id")
        ) {
          const number = body?.meta?.sender?.phone_number.replace("+", "");
          const idAssigned =
            body?.changed_attributes[0]?.assignee_id?.current_value ?? null;

          if (idAssigned) {
            bot.blacklist.add(number);
          } else {
            bot.blacklist.remove(number);
          }
          res.end("ok");
          return;
        }

        /**
         * La parte que se encarga de determinar si un mensaje es enviado al whatsapp del cliente
         */
        const checkIfMessage =
          body?.private == false &&
          body?.event == "message_created" &&
          body?.message_type === "outgoing" &&
          body?.conversation?.channel.includes("Channel::Api");

        if (checkIfMessage) {
          const number = body.conversation?.meta?.sender?.phone_number.replace(
            "+",
            ""
          );
          const message = body?.content ?? "";

          const file = attachments?.length ? attachments[0] : null;
          const media = file?.data_url ?? null;

          if (file) {
            console.log(`Este es el archivo adjunto...`, file.data_url);
            if (media && media.includes(".oga")) {
              await bot.sendAudio(number, media);
            } else {
              await bot.sendMessage(number, message, { media });
            }
            res.end("ok");
            return;
          }

          /**
           * esto envia un mensaje de texto al ws
           */
          await bot.sendMessage(number, message, {});

          res.end("ok");
          return;
        }

        res.end("ok");
      } catch (error) {
        console.log(error);
        return res.end("Error");
      }
    })
  );
};
