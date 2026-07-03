import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success:false,
            message:"Email and password are required."
        });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
            success:false,
            message:"Invalid credentials"
        });
    }

    const token = generateToken(user._id);

    res.status(200).json({
        success:true,
        message:"Login successful",
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        }
    });

};