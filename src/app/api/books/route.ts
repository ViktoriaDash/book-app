import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const getSql = () => {
  const connectionString = process.env.NODE_ENV === 'development' 
    ? process.env.POSTGRES_URL_DEV 
    : process.env.POSTGRES_URL;
  return neon(connectionString!);
};

export async function GET(request: Request) {
  try {
    const sql = getSql();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const lang = searchParams.get('lang'); 
    const page = parseInt(searchParams.get('page') || '1');
    
    const limit = 8;
    const offset = (page - 1) * limit;
    const searchPattern = `%${search}%`;

    const books = await sql`
      SELECT b.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as reviews_count
      FROM books b
      LEFT JOIN reviews r ON b.id = r.book_id
      WHERE (b.title ILIKE ${searchPattern} OR b.author ILIKE ${searchPattern})
      ${search ? sql`` : sql`AND b.is_ebook = FALSE`} 
      ${category && category !== "" ? sql`AND b.category = ${category}` : sql``}
      ${lang && lang !== "" ? sql`AND b.language = ${lang}` : sql``}
      GROUP BY b.id
      ORDER BY b.id DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countRes = await sql`
      SELECT COUNT(*) FROM books 
      WHERE (title ILIKE ${searchPattern} OR author ILIKE ${searchPattern})
      ${search ? sql`` : sql`AND is_ebook = FALSE`}
      ${category && category !== "" ? sql`AND category = ${category}` : sql``}
      ${lang && lang !== "" ? sql`AND language = ${lang}` : sql``}
    `;

    const totalBooks = parseInt(countRes[0].count);
    const totalPages = Math.ceil(totalBooks / limit);

    return NextResponse.json({ books, totalPages, currentPage: page });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sql = getSql();
    const body = await request.json();
    const { title, author, category, language, image_url, description, is_ebook } = body;

    await sql`
      INSERT INTO books (title, author, category, language, image_url, description, is_ebook)
      VALUES (${title}, ${author}, ${category}, ${language}, ${image_url}, ${description}, ${is_ebook})
    `;

    return NextResponse.json({ message: "Книгу додано!" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}