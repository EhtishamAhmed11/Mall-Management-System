const createTokenUser = (user) => {
  return { username: user.username, user_id: user._id, role: user.role };
};

export default createTokenUser