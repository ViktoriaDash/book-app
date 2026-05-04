import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const getSql = () => {
  const connectionString = process.env.NODE_ENV === 'development' 
    ? process.env.POSTGRES_URL_DEV 
    : process.env.POSTGRES_URL;
  return neon(connectionString!);
};

export async function GET() {
  try {
    const sql = getSql();
    const books = await sql`SELECT * FROM books ORDER BY id DESC`;
    return NextResponse.json(books);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author, price, description } = body;
    const sql = getSql();
    
    const result = await sql`
      INSERT INTO books (title, author, price, description)
      VALUES (${title}, ${author}, ${price}, ${description})
      RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}