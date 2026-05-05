import jwt from "jsonwebtoken";

export const authentication = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .json({ ok: false, error: { message: "unauthorized!" } });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ ok: false, error: { message: "token required" } });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ ok: false, error: { message: "invalid or expired token" } });
  }
};

export default authentication;
