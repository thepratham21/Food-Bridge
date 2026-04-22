export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  let cookieName="Token";
  
  // Determine the cookie name based on the user role
 
  res.status(statusCode).cookie(cookieName, token, {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  })
  .json({
    success: true,
    message,
    user,
    token,
  });
};
