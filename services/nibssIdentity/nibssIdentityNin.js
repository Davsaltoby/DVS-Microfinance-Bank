import { nibssPublicClient } from "../nibssClient.js";
const createNinNibss = async ({ nin, firstName, lastName, dob }) => {
  try {
    const res = await nibssPublicClient.post("/api/insertNin", {
      nin,
      firstName,
      lastName,
      dob,
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error("NIN already exists");
    }
    throw new Error("NIN creation failed");
  }
};

const validateNinNibss = async ({ nin }) => {
  try {
    const res = await nibssPublicClient.post("/api/validateNin", {
      nin,
    });
    return res.data;
  } catch (error) {
    console.error("Error validating NIN:", error.response?.data);

    const status = error.response?.status;

    if (status === 400) throw new Error("Invalid NIN provided");
    if (status === 409) throw new Error("nin already linked to an account");

    throw new Error("Failed to validate NIN");
  }
};

export { createNinNibss, validateNinNibss };
