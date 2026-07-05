import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
    }

    // Initialize database table if not already created
    await initDb();

    // Insert user into waitlist database
    await sql`INSERT INTO waitlist (email) VALUES (${email}) ON CONFLICT (email) DO NOTHING`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Waitlist Registration Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to record entry. Try again.' }, { status: 500 });
  }
}
