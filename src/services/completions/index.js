import { openai } from "../config.js";

const createArrayMessageDifucion = async (copy) => {
  let messages = [];

  while (messages.length < 5) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              'Se te proporcionarán mensajes no estructurados, y tu tarea será crear 5 mensajes dentro de un arreglo. NO APLIQUES FORMATO DE MARKDAWN.\n\nEjemplo:\n    USER: He visto que has escrito recientemente, y tenemos una promoción para ti, si pides más de dos productos a envío a tu casa te llevaremos un regalo sorpresa, ¿te gustaría saber más?\n    ASSISTANT: ["¡Descubre nuestra promoción especial! Por la compra de dos productos o más con envío a domicilio, recibirás un regalo sorpresa. ¿Quieres saber más detalles?","¿Sabías que al comprar más de dos productos con envío a tu casa, puedes llevarte un regalo sorpresa? ¡Aprovecha esta promoción exclusiva!","¡No te pierdas nuestra oferta especial! Compra dos productos o más con envío a domicilio y recibe un regalo sorpresa. ¿Te interesa saber más?","¡Atención! Tenemos una promoción especial: al adquirir más de dos productos con envío a tu hogar, recibirás un regalo sorpresa. ¿Quieres saber más?","¿Te gustaría recibir un regalo sorpresa? Compra dos productos o más con envío a tu casa y disfruta de nuestra promoción especial. ¡Aprovecha esta oportunidad!"] \n\n Si el mensaje tiene emojis juega con ellos también, puedes hacer variantes de estos, no los elimines. \n\n SOLO UTILIZARAS COMILLAS DOBLES " " PARA CREAR EL ARREGLO.',
          },
          {
            role: "user",
            content: copy,
          },
        ],
        temperature: 0.7,
        top_p: 1,
      });

      const textResponse = response.choices[0].message.content;
      messages = JSON.parse(textResponse);

      if (messages.length < 5) {
        throw new Error("Array has less than 5 elements");
      }
    } catch (error) {
      console.error(
        "Error parsing messages or insufficient messages, retrying...",
        error
      );
    }
  }

  return messages;
};

export { createArrayMessageDifucion };
