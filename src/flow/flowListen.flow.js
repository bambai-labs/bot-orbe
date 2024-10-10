import { addKeyword, EVENTS } from "@builderbot/bot";
import { createThreads } from "../services/assistant/index.js";
import { obtener_usuario, crear_usuario } from "../api/funciones.js";
import { transcription } from "../services/whisper/index.js";
import { flowAssistant } from "./flowAssistant.flow.js";

export const flowListen = addKeyword(EVENTS.VOICE_NOTE).addAction(
    async (ctx, { provider, flowDynamic, gotoFlow, state, globalState }) => {
        const telefono = ctx.from;
        const myGlobalState = globalState.getAllState();
        const users = globalState.get("users") || [];
        const audioPath = await provider.saveFile(ctx, { path: 'src/audio' });
        ctx.audioPath = audioPath;

        try {
            const transcriptionResult = await transcription(audioPath);

            if (!transcriptionResult) {
                return await flowDynamic("Estamos teniendo problemas técnicos 🤕");
            }

            const trimmedTranscription = transcriptionResult.trim();

            if (!trimmedTranscription) {
                return await flowDynamic("No te he podido escuchar bien, ¿podrías repetir lo que dijiste, por favor?");
            }

            ctx.body = trimmedTranscription;


            let user = users.find((user) => user.telefono === telefono);

            if (!user) {
                const res = await obtener_usuario({ telefono });

                if (res.success && res.data.theread_id) {
                    user = res.data;
                } else {
                    const theread_id = await createThreads();

                    if (!theread_id) {
                        console.log("Error al crear el thread");
                        return await flowDynamic("Estamos teniendo problemas técnicos🤕");
                    }

                    const req = { telefono, theread_id };
                    const userCreationRes = await crear_usuario(req);

                    if (!userCreationRes.success) {
                        console.log("Error al crear el usuario");
                        return await flowDynamic("Estamos teniendo problemas técnicos🤕");
                    }

                    user = userCreationRes.data;
                }

                await globalState.update({
                    ...myGlobalState,
                    users: [...users, user],
                });
            }

            await state.update({ user });
            return gotoFlow(flowAssistant);
        } catch (error) {
            console.log("Error en welcome", error);
            return await flowDynamic("Estamos teniendo problemas técnicos🤕.");
        }
    }
);
