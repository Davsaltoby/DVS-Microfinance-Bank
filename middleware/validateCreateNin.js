const validateCreateNin = async (req, res, next) => {
  const { nin, firstName, lastName, dob } = req.body;

  if (!nin?.trim() || !firstName?.trim() || !lastName?.trim() || !dob?.trim()) {
    return res
      .status(400)
      .json({ ok: false, error: { message: "all fields are required" } });
  }

  next();
};

export { validateCreateNin };
