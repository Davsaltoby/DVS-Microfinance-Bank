import { createBvnNibss } from "../../services/nibssIdentity/nibssIdentityBvn.js";
const createBvn = async (req, res) => {
  const { bvn, firstName, lastName, dob, phone } = req.body;
  try {
    const response = await createBvnNibss({
      bvn,
      firstName,
      lastName,
      dob,
      phone,
    });

    res.status(201).json({
      ok: true,
      message: response.message,
      data: response.data,
    });

    console.log(response);
  } catch (err) {
    if (err.message === "BVN already exists") {
      return res
        .status(409)
        .json({ ok: false, error: { message: err.message } });
    }
    res.status(500).json({ ok: false, error: { message: err.message } });

    console.error(`Error: ${err.message}`);
  }
};

export { createBvn };
