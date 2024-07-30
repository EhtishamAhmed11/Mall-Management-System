import CustomAPIError from "../errors/index.js";
const checkPermissions = (requestUser, resourceUserId) => {
  console.log("Request User:", requestUser);
  console.log("Resource User ID:", resourceUserId);
  console.log("Type of Resource User ID:", typeof resourceUserId);
  console.log("Request User ID:", requestUser.user_id);
  console.log("Type of Request User ID:", typeof requestUser.user_id);

  if (requestUser.role === "admin") return;
  if (
    requestUser.role === "retailer" &&
    requestUser.userId === resourceUserId.toString()
  )
    return;

  throw new CustomAPIError.UnauthorizedError(
    "Not authorized to perform this action"
  );
};

export default checkPermissions;
