import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import sendMail from "../mail.js";
import { verifyEmail } from "../controllers/usersControllers.js";

const registerUser = async (information) => {
    try {
        const { password, email, subscription, verificationToken } = information;
      
      console.log('Checking if user exists:', email);
      
      const user = await User.findOne({ email });
      
      if (user !== null) {
             console.log('User already exists:', email);
            return null;
        }

        console.log('Hashing password for user:', email);
      const passwordHash = await bcrypt.hash(password, 10);
      
    await sendMail({
        to: email,
        from: "noreply@yourdomain.com",
        subject: 'Hello!!!',
        html: `Click on <a href="http://localhost:3000/auth/verify/${verificationToken}">Link</a>`,
        text: `Click on link http://localhost:3000/auth/verify/${verificationToken}`
    });   
      
         console.log('Creating new user in the database:', email);
        
      const newUser = await User.create({
        email,
        password: passwordHash,
        verificationToken,
        subscription,
        avatarURL: gravatar.url(email),
    });
        return newUser;
    } catch (error) {
       console.error('Error in registerUser service:', error);
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
      
      if (user.verify === false) {
        return null;
      }

        const token = jwt.sign(
            { id: user._id, email: user.email, subscription: user.subscription },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h",
            }
      );
      
        await User.findByIdAndUpdate(user._id, { token });

        return { token, user };
    } catch (error) {
         console.error('Error in loginUser function:', error);
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
  } catch (error) {
    throw new Error('Error updating subscription');
  }
};

const updateUserAvatar = async (userId, avatarURL) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatarURL },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error('Error updating avatar');
  }
};

const getUserAvatar = async (id) => {
  try {
    const user = await User.findById(id);
    
    return user.avatarURL;
  } catch (error) {
    throw new Error('Error getUser avatar');
  }

};

export const verifyUser = async (verificationToken) => {

  try {
    const user = await User.findOne({ verificationToken });

    if (user === null) {
      return null;
    }
  
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
    return user;
  } catch (error) {
    throw new Error('Error verifying user');
  }
}

export default {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateSubscriptionUser,
  updateUserAvatar,
  getUserAvatar,
  verifyUser,
};