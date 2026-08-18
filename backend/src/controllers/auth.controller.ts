import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'agriprice_sl_super_secret_jwt_key_2026';

// In-memory user store for runtime/demo persistence if DB is in dev setup
export interface UserRecord {
  id: string;
  name: string;
  passwordHash: string;
  role: 'FARMER' | 'BUYER' | 'ADMIN';
  phoneNumber?: string;
  district?: string;
  createdAt: string;
}

const mockUserStore = new Map<string, UserRecord>();

// Pre-seed demo users
(async () => {
  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  mockUserStore.set('sunil shantha', {
    id: 'usr_001',
    name: 'Sunil Shantha',
    passwordHash: defaultPasswordHash,
    role: 'FARMER',
    phoneNumber: '+94 77 123 4567',
    district: 'Nuwara Eliya',
    createdAt: new Date().toISOString(),
  });

  mockUserStore.set('colombo buyer', {
    id: 'usr_002',
    name: 'Colombo Buyer',
    passwordHash: defaultPasswordHash,
    role: 'BUYER',
    phoneNumber: '+94 71 987 6543',
    district: 'Colombo',
    createdAt: new Date().toISOString(),
  });
})();

/**
 * Register a new user with Name and Password
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, password, role, district, phoneNumber } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Valid full name is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const key = name.trim().toLowerCase();
    if (mockUserStore.has(key)) {
      return res.status(400).json({ error: 'An account with this name already exists. Please login.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: UserRecord = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      passwordHash,
      role: role || 'FARMER',
      district: district || 'Nuwara Eliya',
      phoneNumber: phoneNumber || '',
      createdAt: new Date().toISOString(),
    };

    mockUserStore.set(key, newUser);

    const userPayload = {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
      district: newUser.district,
      phoneNumber: newUser.phoneNumber,
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: userPayload,
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({ error: 'Failed to register account' });
  }
};

/**
 * Login with Name and Password
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password are required' });
    }

    const key = name.trim().toLowerCase();
    const user = mockUserStore.get(key);

    if (!user) {
      return res.status(401).json({ error: 'Invalid name or password credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid name or password credentials' });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      role: user.role,
      district: user.district,
      phoneNumber: user.phoneNumber,
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: userPayload,
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({ error: 'Failed to authenticate user' });
  }
};

/**
 * Get current authenticated user profile
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    return res.status(200).json({ user: decoded });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
