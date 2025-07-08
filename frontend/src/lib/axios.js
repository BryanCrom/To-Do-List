import axios from "axios";

//localhost doesn't exist in production so the base url must be dynamic
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5123" : "";

const api = axios.create({ baseURL: BASE_URL });

export default api;
