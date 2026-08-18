import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'agriprice_sl_super_secret_jwt_key_2026';

export async function POST(request: Request) {
  try {
    const { name, password, role, district, phoneNumber } = await request.json();

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Valid full name is required' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const userPayload = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      role: role || 'FARMER',
      district: district || 'Nuwara Eliya',
      phoneNumber: phoneNumber || '',
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json(
      {
        message: 'Registration successful',
        token,
        user: userPayload,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to register account' }, { status: 500 });
  }
}
