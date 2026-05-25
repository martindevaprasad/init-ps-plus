import { Router } from 'express';
import { login, register, refreshToken } from '../controllers/authController';
const r = Router();
r.post('/login', login);
r.post('/register', register);
r.post('/refresh', refreshToken);
export default r;
