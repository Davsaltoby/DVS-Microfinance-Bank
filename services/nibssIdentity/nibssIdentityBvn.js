import { nibssPublicClient } from "../nibssClient.js";

const createBvnNibss = async ({ bvn, firstName, lastName, dob, phone }) => {
  try {
    const res = await nibssPublicClient.post("/api/insertBvn", {
      bvn,
      firstName,
      lastName,
      dob,
      phone,
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error("BVN already exists");
    }
    throw new Error("BVN creation failed");
  }
};

const validateBvnNibss = async ({ bvn }) => {
  try {
    const res = await nibssPublicClient.post("/api/validateBvn", {
      bvn,
    });
    return res.data;
  } catch (error) {
    console.error("Error validating BVN:", error.response?.data);

    const status = error.response?.status;

    if (status === 404) throw new Error("Invalid BVN provided");
    if (status === 409) throw new Error("bvn already linked to an account");

    throw new Error("Failed to validate BVN");
  }
};

export { createBvnNibss, validateBvnNibss };
