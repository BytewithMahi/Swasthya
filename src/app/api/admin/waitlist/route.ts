import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    await initDb();
    
    const rows = await sql`SELECT id, email, created_at FROM waitlist ORDER BY created_at DESC`;
    
    return NextResponse.json({ 
      success: true, 
      waitlist: rows.map(row => ({
        id: row.id,
        email: row.email,
        role: 'Beta User', // Default role for standard signups
        date: new Date(row.created_at).toLocaleString()
      }))
    });
  } catch (error: any) {
    console.error('Admin Fetch Waitlist Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database query failed' }, { status: 500 });
  }
}
