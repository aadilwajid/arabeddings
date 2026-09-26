import { NextRequest, NextResponse } from 'next/server';
import { getUsers, saveUser } from '@/lib/store';
import { User } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function GET() {
  const users = getUsers();
  // Don't send passwords
  const safeUsers = users.map(({ password, ...user }) => user);
  return NextResponse.json(safeUsers);
}

export async function POST(request: NextRequest) {
  const { email, password, name, role } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    name,
    role,
    createdAt: new Date().toISOString()
  };
  saveUser(user);
  return NextResponse.json({ success: true, user: { ...user, password: undefined } });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const users = getUsers().filter(u => u.id !== id);
  const fs = await import('fs');
  const path = await import('path');
  fs.writeFileSync(path.join(process.cwd(), 'data', 'users.json'), JSON.stringify(users, null, 2));
  return NextResponse.json({ success: true });
}
