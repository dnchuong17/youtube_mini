import {createAccessToken, createRefreshToken} from "../config/jwt.js";
import dotenv from "dotenv";
import transporter from "../config/transporter.js";
import bcrypt from "bcrypt";
import { sendMailForgotPassword } from "../utils/sendMail.js";
import {PrismaClient} from '@prisma/client';
import {randomCodeNumbers} from "../utils/randomCodeNumbers.js";
import {handle_error} from "../helper/handle_error.js";
import {send_response} from "../helper/send_response.js";

dotenv.config();

const {users, forgot_password_code} = new PrismaClient();

const register = async (req, res) => {
    try {
        const { full_name, email, pass_word } = req.body;

        const userExists = await users.findFirst({
            where: { email: email }
        })
        if (userExists) {
            res.status(400).json({ message: "Account existed, please login!" });
            return;
        }

        const hashPassword = bcrypt.hashSync(pass_word, 10);


        const userNew = await users.create({
            data: {
                full_name,
                email,
                pass_word: hashPassword,
            }
        });

        delete userNew.pass_word;

        const welcomeMail = {
            from: process.env.EMAIL,
            to: email,
            subject: "Welcome to Our Website",
            html: '<h1>Welcome to our website</h1>'
        }

        transporter.sendMail(welcomeMail, (err, info) => {
            if (err) {
                return res.status(500).json({ message: "Fail to send mail!" });
            }
            res.status(200).json(userNew);
        });
    } catch (error) {
        res.status(500).json(`Error ${error}`);
    }
};

const login = async (req, res) => {
    try {
        const { email, pass_word } = req.body;

        const userExists = await users.findFirst({
            where: { email },
        });

        if (!userExists) {
            return res.status(400).json({ message: "Email does not exist" });
        }

        const isPassword = bcrypt.compareSync(pass_word, userExists.pass_word);

        if (!isPassword) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        const payload = {
            userId: userExists.user_id,
            name: userExists.full_name,
        };

        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);

        await users.update({
            data: {
                refresh_token: refreshToken,
            },
            where: {
                user_id: userExists.user_id,
            },
        });

        res.cookie("REFRESH_TOKEN", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.send(accessToken);
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const userExists = await users.findFirst({
            where: {
                email: email
            }
        });

        if(!userExists) {
            return res.status(400).json({message: "Email is not existed"});
        }

        const code = randomCodeNumbers(6);

        const mailForgotPass = {
            from: process.env.EMAIL,
            to: email,
            subject: "Verify code",
            html: `<h1>${ code }</h1>`
        }

        const codeForgotPassExists = await forgot_password_code.findFirst({
            where: {
                user_id: userExists.user_id
            }
        });

        if (codeForgotPassExists) {
            const expired = new Date(new Date().getTime() + 2*60*60*1000);
            await forgot_password_code.update({
                    data: {
                        forgot_code: code,
                        expired: expired
                    },
                    where: {
                        id: codeForgotPassExists.id
                    }
                }
            );

            return sendMailForgotPassword(res, transporter, mailForgotPass);
        } else {
            let expired = new Date(new Date().getTime() + 2*60*60*1000);
            await forgot_password_code.create({
                data : {
                    user_id: userExists.user_id,
                    forgot_code: code,
                    expired: expired
                }
            });
            return sendMailForgotPassword(res, transporter, mailForgotPass);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error API forgotPassword"});
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        console.log(req.body);

        const userExists = await users.findFirst({
            where: {email : email}
        });

        if(!userExists) {
            return res.status(400).json({message: "Email is not existed"});
        }

        let codeExists = await forgot_password_code.findFirst({
            where: {
                user_id: userExists.user_id,
                forgot_code: code
            }
        });

        if(!codeExists) {
            return res.status(400).json({message: "Code is not available"});
        };

        let hashNewPassword = bcrypt.hashSync(newPassword, 10);

        await users.update({
            data: {
                pass_word: hashNewPassword
            },
            where: {
                user_id: userExists.user_id
            }
        });

        const deleted = await forgot_password_code.delete({
            where: {
                id: codeExists.id
            }
        });

        return res.status(200).json({message: "Change password successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error API resetPassword"});
    }
}

const loginFacebook =  async (req, res) => {
    try {
        let {id, email, name} = req.body;

        let userExist = await users.findFirst({
            where: {email: email}
        });

        if (!userExist) {
            let newUser = await users.create({
                data: {
                    full_name: name,
                    email,
                    pass_word: " ",
                    face_app_id: id
                }
            });
            const mailOption = {
                from: process.env.EMAIL,
                to: email,
                subject: "Welcome to Our Website",
                html: `
               <h1>Welcome ${name} to Our Website</h1>
            `
            }
            return transporter.sendMail(mailOption, (err, info) => {
                if(err) {
                    return res.status(500).json({message: "Fail to send email"});
                }

                const payload = {
                    userId: newUser.user_id
                }
                const accessToken = createAccessToken(payload);
                const refreshToken = createRefreshToken(payload);
                return res.status(200).json({message: "Login successfully", accessToken: accessToken, refreshToken: refreshToken});
            })
        }

        if(!userExist.face_app_id) {
            return res.status(400).json({message: "Please login by your account"});
        }

        const payload = {
            userId: userExist.user_id
        }
        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);

        return res.status(200).json({message: "login successfully", accessToken: accessToken, refreshToken: refreshToken});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error API loginFacebook"});
    }
}

const extendToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.REFRESH_TOKEN;

        if (!refreshToken) {
            return res.status(401).json("Unauthorized");
        }

        const userExisted = await users.findFirst({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!userExisted) {
            return res.status(401).json("Unauthorized");
        }
        const payload = {
            userId: userExisted.user_id
        }

        const newAccessToken = createAccessToken(payload);

        return res.send(newAccessToken);
    } catch (error) {
        handle_error(error, res);
    }
}

export { register, login, forgotPassword, resetPassword, loginFacebook, extendToken };