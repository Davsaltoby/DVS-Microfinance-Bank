import { nibbsClient } from "./nibssClient.js";

const createAccountNibss = async ({ kycType, kycID, dob }) => {
  try {
    const res = await nibbsClient.post("/api/account/create", {
      kycType,
      kycID,
      dob,
    });

    return res.data;
  } catch (err) {
    console.log(err.response?.data || err);
    throw new Error(err.response?.data.message);
  }
};

const getAllAccounts = async () => {
  try {
    const accounts = await nibbsClient.get("/api/accounts");
    console.log(accounts.data);
  } catch (error) {
    console.error(error.response?.data);
  }
};

export { createAccountNibss };
