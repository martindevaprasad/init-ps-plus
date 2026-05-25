import jwt from 'jsonwebtoken';

export const generateToken = (user: { _id: any; username: string; email: string; role: string }): string =>
  jwt.sign(
    { id: user._id, username: user.username, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'jwt_secret',
    { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as any }
  );

export const generateRefreshToken = (user: { _id: any }): string =>
  jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET || 'refresh_secret',
    { expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d') as any }
  );
