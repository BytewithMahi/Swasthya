import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    await initDb();
    const rows = await sql`SELECT key, value FROM settings`;
    
    const config: { [key: string]: string } = {};
    rows.forEach(row => {
      config[row.key] = row.value;
    });

    return NextResponse.json({ success: true, settings: config });
  } catch (error: any) {
    console.error('Get settings error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();
    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: 'Key and value are required' }, { status: 400 });
    }

    await initDb();
    
    // Upsert the setting
    await sql`
      INSERT INTO settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) 
      DO UPDATE SET value = EXCLUDED.value;
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Post settings error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to save settings' }, { status: 500 });
  }
}
