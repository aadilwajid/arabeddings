import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUser } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'ara-beddings-secret-key-2026';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = getUser(email);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 60 * 60 * 24 * 7 });

  return response;
}
