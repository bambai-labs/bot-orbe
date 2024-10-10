import { addKeyword, EVENTS } from "@builderbot/bot";
import { flowAssistant } from "./flowAssistant.flow.js";
import { enqueueMessage } from "../utils/index.js";
import getOrCreateUser from "../utils/getOrCreateUser.js";

export const flowWelcome = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, { flowDynamic, gotoFlow, state, globalState }) => {
    try {
      enqueueMessage(ctx, async (body) => {
        ctx.message = body;

        const { user, error } = await getOrCreateUser(ctx, globalState);

        if (error) {
          return await flowDynamic(error);
        }

        // Actualizar el estado local
        await state.update({ user });
        return gotoFlow(flowAssistant);
      });
    } catch (error) {
      console.log("Error en welcome", error);
      return await flowDynamic("Estamos teniendo problemas técnicos🤕.");
    }
  }
);
