import { recording, typing } from "./presence.js";
import { obtenerFechaHoraActual } from "./time.js";
import { createMessageQueue } from "./messageQueue.js";

const enqueueMessage = createMessageQueue({ gapMilliseconds: 8000 });

export { recording, typing, obtenerFechaHoraActual, enqueueMessage };
