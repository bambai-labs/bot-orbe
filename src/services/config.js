import { OPENAI_API_KEY, ELEVENLABS_API_KEY, CHATWOOT_ACCOUNT_ID, CHATWOOT_ENDPOINT, CHATWOOT_TOKEN } from "../config/variables.js";
import OpenAI from "openai";
import { ElevenLabsClient } from "elevenlabs";
import { ChatwootClass } from "./chatwood/chatwood.class.js";
import Queue from "queue-promise";

export const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const elevenlabs = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });

export const chatwoot = new ChatwootClass({
    account: CHATWOOT_ACCOUNT_ID,
    token: CHATWOOT_TOKEN,
    endpoint: CHATWOOT_ENDPOINT,
});


export const queue = new Queue({
    concurrent: 1,
    interval: 500,
});
