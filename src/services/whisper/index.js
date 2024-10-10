import fs from "fs";
import { openai } from "../config.js";

const transcription = async (audioPath) => {
    try {
        const t = await openai.audio.transcriptions.create({
            file: fs.createReadStream(audioPath),
            model: "whisper-1",
        });

        return t.text;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export {
    transcription
}