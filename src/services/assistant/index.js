import fs from "fs";
import { openai } from "../config.js";
import { ASSISTANT_ID } from "../../config/variables.js";
import {
	obtener_servicios,
	obtener_productos,
	ver_disponibilidad,
	obtener_usuario,
	actualizar_usuario,
	reservar,
	ordenar,
	actualizar_hilo,
	actualizar_uso,
	seguimiento,
} from "../../api/funciones.js";

global.obtener_servicios = obtener_servicios;
global.obtener_productos = obtener_productos;
global.ver_disponibilidad = ver_disponibilidad;
global.obtener_usuario = obtener_usuario;
global.actualizar_usuario = actualizar_usuario;
global.reservar = reservar;
global.ordenar = ordenar;
global.seguimiento = seguimiento;

const createThreads = async () => {
	try {
		const threads = await openai.beta.threads.create();
		return threads.id;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const createMessage = async (message, theread_id) => {
	try {
		const threadMessages = await openai.beta.threads.messages.create(
			theread_id,
			{ role: "user", content: message }
		);
		return threadMessages.id;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const createMessageImage = async (message, imagePath, theread_id) => {
	try {
		const file = await openai.files.create({
			file: fs.createReadStream(imagePath),
			purpose: "vision",
		});

		const contentArray = [
			{
				type: "image_file",
				image_file: {
					file_id: file.id,
				},
			},
		];

		if (message) {
			contentArray.push({
				type: "text",
				text: message,
			});
		}

		const threadMessages = await openai.beta.threads.messages.create(
			theread_id,
			{
				role: "user",
				content: contentArray,
			}
		);

		return threadMessages.id;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const createRun = async (theread_id, today, number, isAudio = false) => {
	const additionalInstructions = `
    ====== INFO DEL MENSAJE ======\n
    Recibido el: ${today} \n
    Teléfono del usuario: ${number} \n
    ===================================\n
    ${
			isAudio
				? "El mensaje es un audio, la respuesta será un archivo de audio. Solo debe generar texto para su conversión a audio."
				: ""
		}
  `;

	const run = await openai.beta.threads.runs.create(theread_id, {
		assistant_id: ASSISTANT_ID,
		additional_instructions: additionalInstructions,
	});

	return run.id;
};

const checkRun = async (theread_id, run_id, number) => {
	let runStatus = openai.beta.threads.runs.retrieve(theread_id, run_id);
	const functionNames = [];
	const logsFunctions = [];

	while (runStatus.status !== "completed") {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		runStatus = await openai.beta.threads.runs.retrieve(theread_id, run_id);

		if (runStatus.status === "requires_action") {
			const toolCalls =
				runStatus.required_action.submit_tool_outputs.tool_calls;

			const toolOutputs = [];

			for (const toolCall of toolCalls) {
				const functionName = toolCall.function.name;
				console.log(`Se necesita ejecutar la función ${functionName} 🔍`);
				functionNames.push(functionName);

				const args = JSON.parse(toolCall.function.arguments);

				console.log(args);

				// Llamada de función API dinámica
				const output = await global[functionName].apply(null, [args]);

				logsFunctions.push(output.success);

				const outputstring = JSON.stringify(output);

				console.log(outputstring);

				toolOutputs.push({
					tool_call_id: toolCall.id,
					output: outputstring,
				});
			}

			await openai.beta.threads.runs.submitToolOutputs(theread_id, run_id, {
				tool_outputs: toolOutputs,
			});

			continue;
		}

		if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
			console.log(runStatus);
			console.log("El run ha fallado ❌");
			break;
		}
	}

	if (runStatus.status === "completed") {
		const response = await actualizar_uso({
			token: runStatus.usage.total_tokens,
		});
		if (!response.success) {
			console.log("Error al actualizar el uso");
		}
	}

	if (
		(functionNames.includes("reservar") || functionNames.includes("ordenar")) &&
		runStatus.status === "completed" &&
		logsFunctions.every((log) => log === true)
	) {
		console.log("Reseteando el hilo 🔄");
		const newTheread_id = await createThreads();
		await actualizar_hilo({ telefono: number, theread_id: newTheread_id });
	}

	return runStatus;
};

const cancelRun = async (theread_id, run_id) => {
	try {
		const run = await openai.beta.threads.runs.cancel(theread_id, run_id);
		return run;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const listMessages = async (theread_id) => {
	try {
		const messages = await openai.beta.threads.messages.list(theread_id, {
			limit: 1,
			order: "desc",
		});
		return messages.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export {
	createThreads,
	createMessage,
	createMessageImage,
	createRun,
	checkRun,
	listMessages,
	cancelRun,
};
