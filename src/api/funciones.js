import axios from "axios";
import { URL_API, COOKIE_ADMIN_JWT } from "../config/variables.js";

const obtener_usuario = async (data) => {
	try {
		const response = await axios.post(`${URL_API}/obtener_usuario`, data, {
			headers: {
				Cookie: `token=${COOKIE_ADMIN_JWT}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			return {
				success: false,
				message: error.message,
			};
		}
	}
};

const crear_usuario = async (data) => {
	try {
		const response = await axios.post(`${URL_API}/crear_usuario`, data, {
			headers: {
				Cookie: `token=${COOKIE_ADMIN_JWT}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			return {
				success: false,
				message: error.message,
			};
		}
	}
};

const actualizar_usuario = async (data) => {
	try {
		const response = await axios.put(`${URL_API}/actualizar_usuario`, data, {
			headers: {
				Cookie: `token=${COOKIE_ADMIN_JWT}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			return {
				success: false,
				message: error.message,
			};
		}
	}
};

const actualizar_hilo = async (data) => {
	try {
		const response = await axios.put(`${URL_API}/actualizar_hilo`, data, {
			headers: {
				Cookie: `token=${COOKIE_ADMIN_JWT}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			return {
				success: false,
				message: error.message,
			};
		}
	}
};

const obtener_servicios = async () => {
	try {
		const response = await axios.get(`${URL_API}/obtener_servicios`, {
			headers: {
				Cookie: `token=${COOKIE_ADMIN_JWT}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			return {
				success: false,
				message: error.message,
			};
		}
	}
};

const obtener_productos = async () => {
	try {
		const response = await axios.get(`${URL_API}/obtener_productos`, {
			headers: {
				Cookie: `token=${COOKIE_ADMIN_JWT}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			return {
				success: false,
				message: error.message,
			};
		}
	}
};

const ver_disponibilidad = async (data) => {
	try {
		const response = await axios.post(`${URL_API}/ver_disponibilidad`, data, {
			headers: {
				Cookie: `token=${COOKIE_ADMIN_JWT}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			return {
				success: false,
				message: error.message,
			};
		}
	}
};

const reservar = async (data) => {
	try {
		const response = await axios.post(`${URL_API}/reservar`, data, {
			headers: {
				Cookie: `token=${COOKIE_ADMIN_JWT}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			return {
				success: false,
				message: error.message,
			};
		}
	}
};

const ordenar = async (data) => {
	try {
		const response = await axios.post(`${URL_API}/ordenar`, data, {
			headers: {
				Cookie: `token=${COOKIE_ADMIN_JWT}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			return {
				success: false,
				message: error.message,
			};
		}
	}
};

const crear_huecos = async () => {
	const huecos = [];

	const daysInMarch = 30;
	const domingos = [2, 9, 16, 23, 30];
	const sabados = [1, 8, 15, 22, 29];

	for (let day = 1; day <= daysInMarch; day++) {
		if (!domingos.includes(day)) {
			const fecha = `2024-06-${day.toString().padStart(2, "0")}`;

			huecos.push(
				{
					fecha: fecha,
					start: "08:00:00",
					end: "09:00:00",
				},
				{
					fecha: fecha,
					start: "09:00:00",
					end: "10:00:00",
				},
				{
					fecha: fecha,
					start: "10:00:00",
					end: "11:00:00",
				},
				{
					fecha: fecha,
					start: "11:00:00",
					end: "12:00:00",
				}
			);

			if (!sabados.includes(day)) {
				huecos.push(
					{
						fecha: fecha,
						start: "14:00:00",
						end: "15:00:00",
					},
					{
						fecha: fecha,
						start: "15:00:00",
						end: "16:00:00",
					}
				);
			}
		}
	}

	for (const hueco of huecos) {
		try {
			await axios.post(`${URL_API}/crear_hueco`, hueco, {
				headers: {
					Cookie: `token=${COOKIE_ADMIN_JWT}`,
				},
			});
		} catch (error) {
			console.log(error);
		}
	}
};

const actualizar_uso = async (data) => {
	try {
		const response = await axios.put(`${URL_API}/actualizar_uso`, data, {
			headers: {
				Cookie: `token=${COOKIE_ADMIN_JWT}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			return {
				success: false,
				message: error.message,
			};
		}
	}
};

const actualizar_estado = async (data) => {
	try {
		const response = await axios.put(`${URL_API}/actualizar_estado`, data, {
			headers: {
				Cookie: `token=${COOKIE_ADMIN_JWT}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			return {
				success: false,
				message: error.message,
			};
		}
	}
};

const seguimiento = async (data) => {
	try {
		const response = await axios.post(`${URL_API}/seguimiento`, data, {
			headers: {
				Cookie: `token=${COOKIE_ADMIN_JWT}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else {
			return {
				success: false,
				message: error.message,
			};
		}
	}
};

export {
	obtener_usuario,
	crear_usuario,
	actualizar_usuario,
	actualizar_hilo,
	obtener_servicios,
	obtener_productos,
	ver_disponibilidad,
	reservar,
	ordenar,
	crear_huecos,
	actualizar_uso,
	actualizar_estado,
	seguimiento,
};
