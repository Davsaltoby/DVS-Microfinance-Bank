import axios from "axios";

let cachedToken = null;
let tokenExpiry = null;
const getNibssToken = async () => {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  try {
    const res = await axios.post(
      `${process.env.NIBSS_BASE_URL}api/auth/token`,
      {
        apiKey: process.env.NIBSS_API_KEY,
        apiSecret: process.env.NIBSS_API_SECRET,
      },
    );

    cachedToken = res.data.token;
    tokenExpiry = Date.now() + 55 * 60 * 1000;
    return cachedToken;
  } catch (error) {
    console.error("Error fetching NIBSS token:", error);
    throw error;
  }
};

export default getNibssToken;
