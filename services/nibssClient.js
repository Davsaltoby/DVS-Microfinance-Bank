import axios from "axios";
import getNibssToken from "./tokenConfig.js";

const nibssClient = axios.create({
  baseURL: process.env.NIBSS_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

nibssClient.interceptors.request.use(async (config) => {
  const token = await getNibssToken();
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

const nibssPublicClient = axios.create({
  baseURL: process.env.NIBSS_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { nibssClient, nibssPublicClient };
