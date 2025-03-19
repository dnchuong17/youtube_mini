import express from "express";
import {extendToken, forgotPassword, login, loginFacebook, register, resetPassword} from "../services/auth_service.js";

const authRoutes = express();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/reset-password', resetPassword);
authRoutes.post('/login-facebook', loginFacebook)
authRoutes.post('/extend', extendToken);


export default authRoutes;