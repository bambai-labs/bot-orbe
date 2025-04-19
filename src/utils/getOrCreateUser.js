import { obtener_usuario, actualizar_hilo, crear_usuario } from "../api/funciones.js";
import { createThreads } from "../services/assistant/index.js";

// Función auxiliar para buscar o crear un usuario
async function getOrCreateUser(ctx, globalState) {
    const telefono = ctx.from;
    const myGlobalState = globalState.getAllState();
    const users = globalState.get("users") || [];

    // Buscar si el usuario ya existe en el globalState
    let user = users.find((user) => user.telefono === telefono);

    if (!user) {
        // Si el usuario no está en el globalState, buscarlo en el sistema
        const res = await obtener_usuario({ telefono });

        // Si el usuario existe pero no tiene theread_id, actualizar hilo
        if (res.success && (!res.data.theread_id || res.data.theread_id === "")) {
            const theread_id = await createThreads();

            if (!theread_id) {
                console.log("Error al crear el thread");
                return { error: "Estamos teniendo problemas técnicos🤕" };
            }

            const updateRes = await actualizar_hilo({ telefono, theread_id });
            if (!updateRes.success) {
                console.log("Error al actualizar el hilo del usuario");
                return { error: "Estamos teniendo problemas técnicos🤕" };
            }

            user = { ...res.data, theread_id };
        } else if (res.success && res.data.theread_id) {
            // Si el usuario existe y tiene theread_id
            user = res.data;
        } else {
            // Si el usuario no existe, crearlo con un nuevo theread_id
            const theread_id = await createThreads();

            if (!theread_id) {
                console.log("Error al crear el thread");
                return { error: "Estamos teniendo problemas técnicos🤕" };
            }

            const req = { telefono, theread_id };
            const userCreationRes = await crear_usuario(req);

            if (!userCreationRes.success) {
                console.log("Error al crear el usuario");
                return { error: "Estamos teniendo problemas técnicos🤕" };
            }

            user = userCreationRes.data;
        }

        // Actualizar el globalState con el nuevo usuario
        await globalState.update({
            ...myGlobalState,
            users: [...users, user],
        });
    }

    return { user };
}

export default getOrCreateUser;
