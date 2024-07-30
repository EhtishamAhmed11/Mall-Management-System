import { isTokenValid } from "../utils/index.js";
import CustomAPIError from "../errors/index.js";

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    console.error("Token validation error 1:", error);
    throw new CustomAPIError.UnauthenticatedError("Unable to Authenticate");
  }
  try {
    console.log("Check 2")
    const { username, user_id, role } = isTokenValid({ token });
    req.user = { username, user_id, role };
    next();
  } catch (error) {
    console.error("Token validation error 2:", error);
    throw new CustomAPIError.UnauthenticatedError("Unable to Authenticate");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomAPIError.UnauthorizedError(
        "You are not authorized to perform this action"
      );
    }
    next();
  };
};

export { authenticateUser, authorizePermissions };
