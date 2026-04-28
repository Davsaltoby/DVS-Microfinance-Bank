import axios from "axios";
import getNibssToken from "./tokenConfig.js";

const nibbsClient = axios.create({
  baseURL: process.env.NIBSS_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

nibbsClient.interceptors.request.use(async (config) => {
  const token = await getNibssToken();
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

const nibbsPublicClient = axios.create({
  baseURL: process.env.NIBSS_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { nibbsClient, nibbsPublicClient };
