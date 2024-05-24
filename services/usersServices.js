import User from "../models/users.js";
import bcrypt from "bcryptjs";

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
    } catch (error) {}
    
}

const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });

        if (user === null) {
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null;
        }

        return { token: "token", user };
    } catch (error) {}
}

const logoutUser = async (information) => {
    return
}

export default {
    registerUser,
    loginUser,
    logoutUser,
}