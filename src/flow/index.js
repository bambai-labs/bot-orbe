import { createFlow } from "@builderbot/bot";
import { flowWelcome } from "./flowWelcome.flow.js";
import { flowAssistant } from "./flowAssistant.flow.js";
import { flowVision } from "./flowVision.flow.js";
import { flowListen } from "./flowListen.flow.js";

export const flow = createFlow([flowWelcome, flowAssistant, flowVision, flowListen]);
