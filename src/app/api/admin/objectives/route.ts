import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    await initDb();

    // Fetch all objectives
    const objectives = await sql`
      SELECT id, username, title, content, created_at 
      FROM objectives 
      ORDER BY created_at DESC
    `;

    // Fetch all comments
    const comments = await sql`
      SELECT id, objective_id, username, content, created_at 
      FROM objective_comments 
      ORDER BY created_at ASC
    `;

    // Nest comments into their respective objectives
    const forumData = objectives.map(obj => {
      return {
        ...obj,
        comments: comments.filter(c => c.objective_id === obj.id)
      };
    });

    return NextResponse.json({ success: true, objectives: forumData });
  } catch (error: any) {
    console.error('Fetch objectives error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch objectives' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, title, content } = await request.json();
    
    if (!username || !title || !content) {
      return NextResponse.json({ success: false, error: 'Username, title, and content are required' }, { status: 400 });
    }

    await initDb();

    // Insert new objective
    const result = await sql`
      INSERT INTO objectives (username, title, content) 
      VALUES (${username}, ${title}, ${content}) 
      RETURNING id, username, title, content, created_at
    `;

    return NextResponse.json({ success: true, objective: { ...result[0], comments: [] } });
  } catch (error: any) {
    console.error('Create objective error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create objective' }, { status: 500 });
  }
}
