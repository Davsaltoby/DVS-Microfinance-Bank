import { createNinNibss } from "../../services/nibssIdentity/nibssIdentityNin.js";
const createNin = async (req, res) => {
  const { nin, firstName, lastName, dob } = req.body;
  try {
    const response = await createNinNibss({
      nin,
      firstName,
      lastName,
      dob,
    });

    res.status(201).json({
      ok: true,
      message: response.message || "NIN created successfully",
      data: response.response,
    });

    console.log(response);
  } catch (err) {
    if (err.message.includes("NIN already exists")) {
      return res
        .status(409)
        .json({ ok: false, error: { message: err.message } });
    }
    res.status(500).json({ ok: false, error: { message: err.message } });

    console.error(`Error: ${err.message}`);
  }
};

export { createNin };
