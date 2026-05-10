import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const getSql = () => {
  const connectionString = process.env.POSTGRES_URL_DEV || process.env.POSTGRES_URL;
  return neon(connectionString!);
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; 
    const sql = getSql();
    
    const book = await sql`SELECT * FROM books WHERE id = ${id}`;
    
    if (!book[0]) {
      return NextResponse.json({ error: "Книгу не знайдено" }, { status: 404 });
    }
    
    return NextResponse.json(book[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const sql = getSql();

    await sql`
      UPDATE books 
      SET 
        title = ${body.title}, 
        author = ${body.author}, 
        category = ${body.category}, 
        language = ${body.language}, 
        description = ${body.description},
        is_ebook = ${body.is_ebook},
        image_url = ${body.image_url}
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
    
    await sql`DELETE FROM books WHERE id = ${id}`;

    return NextResponse.json({ message: "Книгу видалено 🗑️" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}