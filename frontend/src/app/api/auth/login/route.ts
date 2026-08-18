import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'agriprice_sl_super_secret_jwt_key_2026';

export async function POST(request: Request) {
  try {
    const { name, password } = await request.json();

    if (!name || !password) {
      return NextResponse.json({ error: 'Name and password are required' }, { status: 400 });
    }

    const defaultPasswordHash = await bcrypt.hash('password123', 10);

    // Mock verification for demo users or default passwords
    const userPayload = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      role: 'FARMER',
      district: 'Nuwara Eliya',
      phoneNumber: '+94 77 123 4567',
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userPayload,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to authenticate user' }, { status: 500 });
  }
}
