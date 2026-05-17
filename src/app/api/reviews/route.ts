import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const getSql = () => {
  const connectionString = process.env.NODE_ENV === 'development' 
    ? process.env.POSTGRES_URL_DEV 
    : process.env.POSTGRES_URL;
  return neon(connectionString!);
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { book_id, user_name, rating, comment } = body;
    
    const sql = getSql();

    const result = await sql`
      INSERT INTO reviews (book_id, user_name, rating, comment)
      VALUES (${book_id}, ${user_name}, ${rating}, ${comment})
      RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error("Помилка при збереженні відгуку:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

    if (!bookId) {
      return NextResponse.json({ error: "Не вказано ID книги" }, { status: 400 });
    }

    const sql = getSql();

    const reviews = await sql`
      SELECT * FROM reviews 
      WHERE book_id = ${bookId} 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: "Доступ заборонено " }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');

    if (!reviewId) {
      return NextResponse.json({ error: "Не вказано ID відгуку" }, { status: 400 });
    }

    const sql = getSql();

    await sql`
      DELETE FROM reviews 
      WHERE id = ${reviewId}
    `;
    
    return NextResponse.json({ message: "Відгук успішно видалено з бази 🗑️" });
  } catch (error: any) {
    console.error("Помилка при видаленні відгуку:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}