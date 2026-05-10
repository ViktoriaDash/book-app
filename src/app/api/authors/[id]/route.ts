import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const getSql = () => {
  const connectionString = process.env.NODE_ENV === 'development' 
    ? process.env.POSTGRES_URL_DEV 
    : process.env.POSTGRES_URL;
  return neon(connectionString!);
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sql = getSql();
    
    const author = await sql`SELECT * FROM authors WHERE id = ${id}`;
    
    if (!author[0]) {
      return NextResponse.json({ error: "Автора не знайдено" }, { status: 404 });
    }
    
    return NextResponse.json(author[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, bio, image_url } = await req.json();
    const sql = getSql();

    await sql`
      UPDATE authors 
      SET name = ${name}, bio = ${bio}, image_url = ${image_url} 
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sql = getSql();

    const result = await sql`DELETE FROM authors WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: "Автора видалено" });
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Не вдалося видалити: можливо, у цього автора ще є книги в базі." 
    }, { status: 500 });
  }
}