import axios from "axios";

export const AxiosClient = axios.create({
	baseURL: "/api",
});
