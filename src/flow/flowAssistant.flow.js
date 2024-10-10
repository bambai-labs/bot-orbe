import { addKeyword } from "@builderbot/bot";
import {
  createMessage,
  createRun,
  checkRun,
  listMessages,
  createMessageImage,
} from "../services/assistant/index.js";
import { typing, obtenerFechaHoraActual, recording } from "../utils/index.js";
import { audioElevenlabs } from "../services/tts/index.js";

const flowAssistant = addKeyword("ASSISTANT").addAction(
  async (ctx, { flowDynamic, provider, state }) => {
    const number = ctx.from;
    const message = ctx.body;
    const imagePath = ctx.imagePath;
    const audioPath = ctx.audioPath;
    const myState = state.getMyState();

    if (audioPath) {
      await recording(ctx, provider);
    } else {
      await typing(ctx, provider);
    }

    const theread_id = myState.user.theread_id;

    const today = obtenerFechaHoraActual();

    const message_id = imagePath ? await createMessageImage(message, imagePath, theread_id) : await createMessage(message, theread_id);

    if (message_id === null) {
      //await cancelRun(theread_id, "run_fGBeelZZnYqRdPEAsRTbp5RN");
      console.log("Error al crear el mensaje");
      return await flowDynamic(
        "Para entenderte mejor, enviame todo en un solo mensaje😊"
      );
    }

    const run_id = await createRun(theread_id, today, number, audioPath ? true : false);

    if (run_id === null) {
      console.log("Error al crear el run");
      return await flowDynamic("Estamos tenido problemas tecnicos🤕.");
    }

    const run = await checkRun(theread_id, run_id, number);

    if (
      run === null ||
      ["failed", "cancelled", "expired"].includes(run.status)
    ) {
      console.log("Error al chekear el run");
      return await flowDynamic("Estamos tenido problemas tecnicos🤕.");
    }

    const messages = await listMessages(theread_id);

    if (messages === null) {
      console.log("Error al listar los mensajes");
      return await flowDynamic("Estamos tenido problemas tecnicos🤕.");
    }

    const lastMessage = messages[0].content[0].text.value;

    if (audioPath) {
      // Primero extraemos las imágenes del mensaje antes de convertirlo a audio
      const chunks = lastMessage.split(/\n\n+/);
      let cleanText = "";

      for (const chunk of chunks) {
        // Verificar si el chunk contiene una imagen en formato Markdown
        const match = chunk.match(/^!\[.*\]\((https?:\/\/.*)\)$/);
        if (match && match.length > 1) {
          // Si es una imagen en formato Markdown, extraer el enlace de la imagen
          const enlace = match[1];
          // Enviar la imagen como medio
          await flowDynamic([{ media: enlace }]);
        } else {
          // Eliminar las imágenes Markdown del texto para evitar que se pasen al audio
          const textoSinImagen = chunk.replace(/!\[.*\]\(https?:\/\/.*\)/, "").trim();
          // Acumular el texto limpio sin imágenes
          if (textoSinImagen.length > 0) {
            cleanText += textoSinImagen + "\n\n";
          }
        }
      }

      // Genera el audio a partir del texto limpio (sin imágenes)
      const nameFile = await audioElevenlabs(cleanText.trim());
      // Envía el archivo de audio
      return await provider.sendAudio(ctx.key.remoteJid, 'src/audio/' + nameFile);

    } else {
      const chunks = lastMessage.split(/\n\n+/);
      for (const chunk of chunks) {
        // Verificar si el chunk contiene una imagen en formato Markdown
        const match = chunk.match(/^!\[.*\]\((https?:\/\/.*)\)$/);
        if (match && match.length > 1) {
          // Si es una imagen en formato Markdown, extraer el enlace
          const enlace = match[1];
          await flowDynamic([{ media: enlace }]);
        } else {
          // Si no es una imagen en formato Markdown, revisar texto y enlace
          const texto = chunk.replace(/!\[.*\]\(https?:\/\/.*\)/, "").trim(); // Eliminar cualquier imagen Markdown y trim
          const enlaceMatch = chunk.match(/!\[.*\]\((https?:\/\/.*)\)/);
          if (enlaceMatch && enlaceMatch.length > 1) {
            const enlace = enlaceMatch[1];
            await flowDynamic([{ body: texto, media: enlace }]);
          } else {
            // Si no hay enlace de imagen, procesar como texto normal
            await flowDynamic([{ body: chunk.trim() }]);
          }
        }
      }
    }
  }
);

export { flowAssistant };
