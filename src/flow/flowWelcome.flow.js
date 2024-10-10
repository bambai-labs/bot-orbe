import { addKeyword, EVENTS } from "@builderbot/bot";
import { createThreads } from "../services/assistant/index.js";
import { obtener_usuario, crear_usuario } from "../api/funciones.js";
import { flowAssistant } from "./flowAssistant.flow.js";

export const flowWelcome = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, { flowDynamic, gotoFlow, state, globalState }) => {
    const telefono = ctx.from;
    const myGlobalState = globalState.getAllState();
    const users = globalState.get("users") || [];

    try {
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
