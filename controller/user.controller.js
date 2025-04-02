console.log("MAILTRAP_HOST:", process.env.MAILTRAP_HOST);
console.log("MAILTRAP_PORT:", process.env.MAILTRAP_PORT);
console.log("MAILTRAP_USER:", process.env.MAILTRAP_USER);
console.log("MAILTRAP_PASS:", process.env.MAILTRAP_PASS);
import User from "../model/User.model.js";
import nodemailer from "nodemailer"
import crypto from "crypto"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// async function registerUser(req, res) {
//     //get data
//     //verify data
//     // check if data alr there 
//     //create new user data 
//     //create vfi token 
//     //save token in database
//     // send token to user 
//     //send successs status to user 
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//         return res.status(400).json({
//             message: "all fields req"
//         });
//     }
//     try {
//         const existinguser = await User.findOne({ email });
//         if (existinguser) {
//             return res.status(400).json({
//                 message: "User alreadys exists"
//             });
//         }
//         const user = await User.create({
//             name,
//             email,
//             password
//         });
//         console.log(user);
//         if (!user) {
//             return res.status(400).json({
//                 message: "User not reg"
//             });
//         }
//         const token = crypto.randomBytes(32).toString("hex");
//         console.log(token);
//         user.verificationToken = token;
//         await user.save();
//         //send mail
//         const transporter = nodemailer.createTransport({
//             host: process.env.MAILTRAP_PORT,
//             port: process.env.MAILTRAP_PORT,
//             secure: false, // true for port 465, false for other ports
//             auth: {
//                 user: process.env.MAILTRAP_USER,
//                 pass: process.env.MAILTRAP_PASS,
//             },
//         });
//         const mailOptions = {
//             from: process.env.MAILTRAP_SENDEREMAIL,
//             to: user.email,
//             subject: "vfy ur email", // Subject line
//             text: please click on the following link:
//     ${process.env.BASE_URL}/api/v1/users/verify/${token},
//         };
//         await transporter.sendMail(mailOptions);
//         res.status(201).json({
//             message: "user reg successfully",
//             success: true
//         });
//     } catch (error) {
//         res.status(400).json({
//             message: "User not registered",
//             success: false,
//             error: error.message,
//         });
//     }

// }
 async function registerUser(req, res) {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password });
        console.log(user);

        if (!user) {
            return res.status(400).json({ message: "User not registered" });
        }

        // Generate verification token
        const token = crypto.randomBytes(32).toString("hex");
        console.log(token);
        user.verificationToken = token;
        await user.save();

        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, // True for 465, false for 2525
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });

        // Verify SMTP connection
        await transporter.verify();
        console.log("✅ SMTP Connected Successfully!");

        // Email options
        const mailOptions = {
            from: process.env.MAILTRAP_SENDEREMAIL || "no-reply@example.com",
            to: user.email,
            subject: "Verify your email",
            text: `Please click on the following link: ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "User registered successfully", success: true });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(400).json({ message: "User not registered", success: false, error: error.message });
    }}
// async function verifyUser(req, res) {
//       //get token from url
//     //validate
//     //find user based on token
//     //if not
//     //isverified true
//     //remove vfi token
//     //save
//     //return response
//     const { token } = req.params;
//     console.log(token);
//     if(!token){
//         return res.status(400).json({
//             message:"invalid one"
//         })
//     }
//        const user= await User.findOne({verificationToken:token})

//        if(!user){
//         return res.status(400).json({
//             message:"invalid one"
//         })

//     }

//         user.isVerified=true
//         user.verificationToken=undefined

//         await user.save()
//         res.status(200).json({ 
//             message: "Email verified successfully", 
//             success: true 
//         });
//     };
async function verifyUser(req, res) {
    console.log("Received URL:", req.url);  // Log full request URL
    console.log("Received params:", req.params); // Log params

    const { token } = req.params;
    console.log("Extracted token:", token); // Log token to verify it's correct

    if (!token) {
        return res.status(400).json({ message: "Token is missing" });
    }

    const user = await User.findOne({ verificationToken: token });
    console.log("User found:", user); // Log user details

    if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully", success: true });
}
  async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Alll fields required"
        });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Alll fields required"
            });
        }
        const pswdmatch = await bcrypt.compare(password, user.password);
        console.log(pswdmatch);
        if (!pswdmatch) {
            return res.status(400).json({
                message: "invalid password"
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET, {
            expiresIn: '24h'
        }

        );
        const cookieOptions = {
            httpOnly: true, //makes it such that it can be accessed by the backend alone
            secure: true,
            maxAge: 24 * 60 * 60 * 100
        };
        res.cookie("test", token, cookieOptions);
        res.status(200).json({
            success: true,
            message: "login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
    }
}
async function getMe(req, res) {
    try {
        const user=await User.findById(req.user.id).select('-password')
        if(!user){
            return res.status(400).json({
                success:false,
                message:"All fields Required",
            });
        }
        res.status(200).json({
            success:true,
            user
        })
console.log("reached at profile lvl")
    } catch (error) {
    }
}  
async function logoutUser(req, res) {
    try {
        res.cookie('token',"",{});
        res.status(200).json({
            success:true,
            message:"logout succesfuuly",
        });
    } catch (error) {
    }
}
// async function forgotPassword(req, res) {
//     //getemail
//     //find user based on email
//     //reset token + reset exipre Date.now()+10*60*1000 =>user.save()
//     //send email==> design url
//     try {
        
//     } catch (error) {
//     }
// }
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.MAILTRAP_SENDEREMAIL || "no-reply@example.com",
            to: user.email,
            subject: "Reset Your Password",
            text: `Click the following link to reset your password:
            ${process.env.BASE_URL}/api/v1/users/reset-password/${resetToken}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset link sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// async function resetPassword(req, res) {
//     const {token} =req.params
//     const{password}=req.body
//     try {
//         // collect token from params
//         // password from req body
//         const user =await User.findOne({
//             resetPasswordToken:token,
//             resetPasswordExpiry:{$gt: Date.now()}
//         })
//         //set password in user 
//         // reset token , resetexpiry => reset
//         // save
        
//     } catch (error) {
//     }
// }
async function resetPassword(req, res) {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }, // Ensure token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        
        await user.save();

        res.status(200).json({ message: "Password reset successful", success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export {registerUser,verifyUser,login,getMe,logoutUser,forgotPassword,resetPassword};
