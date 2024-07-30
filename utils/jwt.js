import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SEC, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SEC);
};

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJwt({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
  //   res.status(StatusCodes.CREATED).json({ user });
};

export { createJwt, isTokenValid, attachCookiesToResponse };
