import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { openai, elevenlabs } from "../config.js";
import { ELEVENLABS_VOICE_ID } from "../../config/variables.js";
import { ElevenLabs } from "elevenlabs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar fluent-ffmpeg para usar el binario de ffmpeg-static
ffmpeg.setFfmpegPath(ffmpegStatic);

const audioOpenai = async (text) => {
	try {
		const nameFile = generateRandomName("opus");
		const audioDir = path.resolve(__dirname, "../../audio");
		const speechFile = path.join(audioDir, nameFile);

		const response = await openai.audio.speech.create({
			model: "gpt-4o-mini-tts",
			voice: "coral",
			input: text,
			response_format: "opus",
		});

		const buffer = Buffer.from(await response.arrayBuffer());
		await fs.promises.writeFile(speechFile, buffer);

		return nameFile;
	} catch (error) {
		console.error("Error al generar el audio:", error);
		return null;
	}
};

const audioElevenlabs = async (text) => {
	try {
		const nameFileMp3 = generateRandomName("mp3");
		const nameFileOpus = generateRandomName("opus");
		const audioDir = path.resolve(__dirname, "../../audio");
		const speechFileMp3 = path.join(audioDir, nameFileMp3);
		const speechFileOpus = path.join(audioDir, nameFileOpus);

		const response = await elevenlabs.textToSpeech.convert(
			ELEVENLABS_VOICE_ID,
			{
				model_id: "eleven_turbo_v2_5",
				optimize_streaming_latency: ElevenLabs.OptimizeStreamingLatency.Zero,
				output_format: ElevenLabs.OutputFormat.Mp32205032,
				text,
				voice_settings: {
					stability: 0.3,
					similarity_boost: 0.82,
				},
			}
		);

		const writeStream = fs.createWriteStream(speechFileMp3);
		response.pipe(writeStream);

		return new Promise((resolve, reject) => {
			writeStream.on("finish", () => {
				console.log(`MP3 Audio file saved: ${nameFileMp3}`);

				// Convert MP3 to OPUS using ffmpeg-static
				ffmpeg(speechFileMp3)
					.toFormat("opus")
					.save(speechFileOpus)
					.on("end", () => {
						console.log(`Converted to OPUS: ${nameFileOpus}`);
						resolve(nameFileOpus);
					})
					.on("error", (err) => {
						console.error("FFmpeg conversion error:", err);
						reject(err);
					});
			});
			writeStream.on("error", (err) => {
				reject(err);
			});
		});
	} catch (error) {
		console.error("Error al generar el audio con ElevenLabs:", error);
		return null;
	}
};

const generateRandomName = (extension) => {
	return `file-${Math.floor(Math.random() * 1000000000000)}.${extension}`;
};

export { audioOpenai, audioElevenlabs };
