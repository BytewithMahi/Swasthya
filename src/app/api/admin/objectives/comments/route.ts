import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { objective_id, username, content } = await request.json();

    if (!objective_id || !username || !content) {
      return NextResponse.json({ success: false, error: 'Objective ID, username, and content are required' }, { status: 400 });
    }

    await initDb();

    // Insert comment
    const result = await sql`
      INSERT INTO objective_comments (objective_id, username, content) 
      VALUES (${objective_id}, ${username}, ${content}) 
      RETURNING id, objective_id, username, content, created_at
    `;

    return NextResponse.json({ success: true, comment: result[0] });
  } catch (error: any) {
    console.error('Create comment error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to post comment' }, { status: 500 });
  }
}
