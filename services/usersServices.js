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
        console.log('User found:', user);

        if (user === null) {
            return null;
        }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
      
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

console.log('Generated JWT token:', token); 
        await User.findByIdAndUpdate(user._id, { token });

        return { token, user };
    } catch (error) {
        console.error("Error in loginUser service:", error);
        throw new Error('Error logging in user');
    }
}

const logoutUser = async (id) => {
    await User.findByIdAndUpdate(id, { token: null });  
}

const currentUser = (authorizationHeader) => {
  const token = authorizationHeader.split(" ")[1];

  const { subscription, email } = jwt.decode(token);
  return { email, subscription };
};

const updateSubscriptionUser = async (id, subscription) => {
  try {
    const data = await User.findByIdAndUpdate(
      id,
      { subscription },
      {
        new: true,
      }
    );
    return data;
  } catch (error) {}
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateSubscriptionUser,
};