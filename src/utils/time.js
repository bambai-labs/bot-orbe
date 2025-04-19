const timeOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
};
const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

function obtenerFechaHoraActual() {
  const date = new Date();
  const time = date.toLocaleTimeString("es-ES", timeOptions);

  // Formatear la fecha
  return `${date.toLocaleDateString("es-ES", dateOptions)} a la(s) ${time} (${
    date.toISOString().split("T")[0]
  })`;
}

export { obtenerFechaHoraActual };
