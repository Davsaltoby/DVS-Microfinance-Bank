const validateCreateBvn = async (req, res, next) => {
  const { bvn, firstName, lastName, dob, phone } = req.body;
  if (
    !bvn?.trim() ||
    !firstName?.trim() ||
    !lastName?.trim() ||
    !dob?.trim() ||
    !phone?.trim()
  ) {
    return res
      .status(400)
      .json({ ok: false, error: { message: "all fields are required" } });
  }

  next();
};

export { validateCreateBvn };
