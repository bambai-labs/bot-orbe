import { addKeyword, EVENTS } from "@builderbot/bot";
import { flowAssistant } from "./flowAssistant.flow.js";
import getOrCreateUser from "../utils/getOrCreateUser.js";

export const flowVision = addKeyword(EVENTS.MEDIA).addAction(
    async (ctx, { provider, flowDynamic, gotoFlow, state, globalState }) => {
        try {
            const localPath = await provider.saveFile(ctx, { path: 'src/assets' });
            ctx.message = ctx.message.imageMessage.caption;
            ctx.imagePath = localPath;

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
