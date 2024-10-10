import { addKeyword, EVENTS } from "@builderbot/bot";
import { transcription } from "../services/whisper/index.js";
import { flowAssistant } from "./flowAssistant.flow.js";
import getOrCreateUser from "../utils/getOrCreateUser.js";

export const flowListen = addKeyword(EVENTS.VOICE_NOTE).addAction(
    async (ctx, { provider, flowDynamic, gotoFlow, state, globalState }) => {
        try {
            const audioPath = await provider.saveFile(ctx, { path: 'src/audio' });
            ctx.audioPath = audioPath;

            const transcriptionResult = await transcription(audioPath);

            if (!transcriptionResult) {
                return await flowDynamic("Estamos teniendo problemas técnicos 🤕");
            }

            const trimmedTranscription = transcriptionResult.trim();

            if (!trimmedTranscription) {
                return await flowDynamic("No te he podido escuchar bien, ¿podrías repetir lo que dijiste, por favor?");
            }

            ctx.message = trimmedTranscription;

            const { user, error } = await getOrCreateUser(ctx, globalState);

            if (error) {
                return await flowDynamic(error);
            }

            await state.update({ user });
            return gotoFlow(flowAssistant);
        } catch (error) {
            console.log("Error en welcome", error);
            return await flowDynamic("Estamos teniendo problemas técnicos🤕.");
        }
    }
);
