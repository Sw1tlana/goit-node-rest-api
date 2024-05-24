import usersService from "../services/usersServices.js";

export const register = async(req, res, next) => {
    try {
        const { password, email, subscription = "starter" } = req.body;
        const result = await usersService.registerUser({ 
            password,
            email,
            subscription,
        });

        if (result === null) {
            return res.status(409).send({ message: "Email in use" });
        }
           return res.status(201).send({
            user: {
            email: result.email,
            subscription: result.subscription,
      },
    });
    } catch(error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await usersService.loginUser({ email, password });

        if (result === null) {
            console.log("Email");
            return res.status(401).send({ message: "Email or password is wrong" });
        }

        return res.status(200).send({
            token: result.token,
            user: {
                email: result.user.email,
                subscription: result.user.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res) => {
    res.status(200).send({ message: "Logout" });
};

export default { register, login, logout };