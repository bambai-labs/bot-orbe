import { recording, typing } from "./presence.js";
import { obtenerFechaHoraActual } from "./time.js";
import { createMessageQueue } from "./fast.js";

const enqueueMessage = createMessageQueue({ gapMilliseconds: 4000 });

export { recording, typing, obtenerFechaHoraActual, enqueueMessage };
