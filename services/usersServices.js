import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (information) => {
    try {
        const { password, email, subscription } = information;
      
        const user = await User.findOne({ email });
        if (user !== null) {
            return null;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: passwordHash,
            subscription,
        });
        return newUser;
    } catch (error) {
        console.error(error);
        throw new Error('Error registering user');
    }
    
}

const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });

        if (user === null) {
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch === false) {
            return null;
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, subscription: user.subscription },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        await User.findByIdAndUpdate(user._id, { token });

        return { token, user };
    } catch (error) {
    }
}

const logoutUser = async (id) => {
    await User.findByIdAndUpdate(id, { token: null });  
}

export default {
    registerUser,
    loginUser,
    logoutUser,
}