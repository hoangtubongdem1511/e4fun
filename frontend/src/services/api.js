import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/** Axios instance for JSON APIs; do not set default Content-Type so FormData uploads work. */
const api = axios.create({
  baseURL,
});

export default api;
