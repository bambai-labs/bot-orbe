import { OPENAI_API_KEY, ELEVENLABS_API_KEY } from "../config/variables.js";
import OpenAI from "openai";
import { ElevenLabsClient } from "elevenlabs";

export const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const elevenlabs = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });