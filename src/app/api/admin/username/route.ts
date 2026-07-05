import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username || !username.trim()) {
      return NextResponse.json({ success: false, error: 'Username is required' }, { status: 400 });
    }

    const normalized = username.trim().toLowerCase();

    // Validate alphanumeric + underscore
    if (!/^[a-zA-Z0-9_]+$/.test(normalized)) {
      return NextResponse.json({ success: false, error: 'Username must contain only letters, numbers, and underscores' }, { status: 400 });
    }

    await initDb();

    // Check if username already exists
    const existing = await sql`
      SELECT username FROM admin_usernames WHERE username = ${normalized}
    `;

    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'Username is already taken by another administrator' }, { status: 409 });
    }

    // Claim username
    await sql`
      INSERT INTO admin_usernames (username) VALUES (${normalized})
    `;

    return NextResponse.json({ success: true, username: normalized });
  } catch (error: any) {
    console.error('Claim username error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to claim username' }, { status: 500 });
  }
}
