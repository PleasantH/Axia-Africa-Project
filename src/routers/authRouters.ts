import { Router } from 'express';

import { login, logout } from '../controllers/authController';


const authRouter = Router();


authRouter.post('/login', login);

authRouter.post('/logout', logout);


export { authRouter as authRoutes };