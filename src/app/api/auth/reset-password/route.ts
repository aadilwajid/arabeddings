import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUsers, saveUser } from '@/lib/store';

export async function POST(request: NextRequest) {
  const { email, newPassword } = await request.json();

  if (!email || !newPassword) {
    return NextResponse.json({ error: 'Email and new password are required' }, { status: 400 });
  }

  const users = getUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  users[userIndex].password = hashedPassword;

  // Save updated users
  const fs = await import('fs');
  const path = await import('path');
  const DATA_DIR = path.join(process.cwd(), 'data');
  fs.writeFileSync(
    path.join(DATA_DIR, 'users.json'),
    JSON.stringify(users, null, 2)
  );

  return NextResponse.json({ success: true, message: 'Password updated successfully' });
}
