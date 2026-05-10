import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connectionString = process.env.POSTGRES_URL_DEV || process.env.POSTGRES_URL;
    const sql = neon(connectionString!);

    const authors = await sql`SELECT DISTINCT author FROM books`;

    return NextResponse.json(authors);
  } catch (error: any) {
    console.error("Помилка API Авторів:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}