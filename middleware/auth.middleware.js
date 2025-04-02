import jwt from "jsonwebtoken";
//bringtoken
//checktoken
//retruverfromdb
export const isLoggedIn = async (req, res, next) => {
  try {
    console.log(req.cookies);
    let token = req.cookies?.test;
    console.log("Token Found", token ? "Yes" : "No");

    if (!token) {
      console.log("No token");
      return res.status(401).json({
        success: false,
        message: "Auth failed",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded data: ", decoded);
    req.user = decoded;
    next();  
  } catch (error) {
    console.log("Auth middleware failure", error);
    return res.status(500).json({ // ✅ Fixed syntax
      success: false,
      message: "Internal server error",
    });
  }
};