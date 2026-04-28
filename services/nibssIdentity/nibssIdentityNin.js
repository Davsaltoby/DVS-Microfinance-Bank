import { nibbsPublicClient } from "../nibssClient.js";
const createNinNibss = async ({ nin, firstName, lastName, dob }) => {
  try {
    const res = await nibbsPublicClient.post("/api/insertNin", {
      nin,
      firstName,
      lastName,
      dob,
    });
    return res.data;
  } catch (error) {
    if (error.response?.data.error.includes("NIN already exists")) {
      throw new Error("NIN already exists");
    }
    console.log(error.response);
    throw new Error("NIN creation failed");
  }
};

const validateNinNibss = async ({ nin }) => {
  try {
    const res = await nibbsPublicClient.post("/api/validateNin", {
      nin,
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error("NIN already exists");
    }
    throw new Error("NIN validation failed");
  }
};

export { createNinNibss, validateNinNibss };
