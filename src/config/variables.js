import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT ?? 4000;

export const URL_API = process.env.URL_API;
export const COOKIE_ADMIN_JWT = process.env.COOKIE_ADMIN_JWT;

export const MONGO_DB_URI = process.env.MONGO_DB_URI;
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const ASSISTANT_ID = process.env.ASSISTANT_ID;

export const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
export const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

export const CHATWOOT_ACCOUNT_ID = process.env.CHATWOOT_ACCOUNT_ID;
export const CHATWOOT_TOKEN = process.env.CHATWOOT_TOKEN;
export const CHATWOOT_ENDPOINT = process.env.CHATWOOT_ENDPOINT;


