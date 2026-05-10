import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const lang = searchParams.get('lang');

    const connectionString = process.env.POSTGRES_URL_DEV || process.env.POSTGRES_URL;
    const sql = neon(connectionString!);
    const searchPattern = `%${search}%`;

    const ebooks = await sql`
      SELECT b.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as reviews_count
      FROM books b
      LEFT JOIN reviews r ON b.id = r.book_id
      WHERE b.is_ebook = TRUE 
      AND (b.title ILIKE ${searchPattern} OR b.author ILIKE ${searchPattern})
      ${category && category !== "" ? sql`AND b.category = ${category}` : sql``}
      ${lang && lang !== "" ? sql`AND b.language = ${lang}` : sql``}
      GROUP BY b.id
      ORDER BY b.id DESC
    `;

    return NextResponse.json(ebooks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}