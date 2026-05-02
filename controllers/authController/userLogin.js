import jwt from "jsonwebtoken";

const userLogin = async (req, res) => {
  const user = req.user;
  try {
    const token = jwt.sign(
      {
        user_id: user?._id,
        userEmail: user?.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" },
    );

    res.status(200).json({ ok: true, message: "user login successful", token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ ok: false, error: { message: "could not login" } });
  }
};

export default userLogin;
