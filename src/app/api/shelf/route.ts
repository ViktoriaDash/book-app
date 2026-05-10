import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';

const getSql = () => {
  const connectionString = process.env.POSTGRES_URL_DEV || process.env.POSTGRES_URL;
  if (!connectionString) throw new Error("Database connection string is missing");
  return neon(connectionString);
};

export async function GET() {
  try {
    const session = await getServerSession();
    
   
    if (!session || !session.user?.email) {
      return NextResponse.json([], { status: 200 });
    }

    const sql = getSql();
    const shelfBooks = await sql`
      SELECT b.*, ub.status, ub.added_at 
      FROM books b 
      JOIN user_books ub ON b.id = ub.book_id
      JOIN users u ON ub.user_id = u.id
      WHERE u.email = ${session.user.email}
      ORDER BY ub.added_at DESC
    `;

    return NextResponse.json(shelfBooks);
  } catch (error: any) {
    console.error("GET Shelf Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bookId } = await req.json();
  const sql = getSql();
  const users = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
  const userId = users[0].id;

  const existing = await sql`SELECT status FROM user_books WHERE user_id = ${userId} AND book_id = ${bookId}`;

  if (existing.length > 0) {
    const currentStatus = existing[0].status;
    
    if (currentStatus === 'read') {
      return NextResponse.json({ message: "Ця книга вже прочитана", isRead: true }, { status: 200 });
    }
    return NextResponse.json({ message: "Вже на полиці", onShelf: true }, { status: 400 });
  }

  await sql`INSERT INTO user_books (user_id, book_id, status) VALUES (${userId}, ${bookId}, 'want_to_read')`;
  return NextResponse.json({ message: "Додано на полицю" });
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const { bookId } = await request.json();
    const sql = getSql();

    const users = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
    const userId = users[0]?.id;

    if (!userId) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await sql`
      DELETE FROM user_books 
      WHERE user_id = ${userId} AND book_id = ${bookId}
    `;

    return NextResponse.json({ message: "Книгу видалено з полиці" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Shelf Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const { bookId, status } = await request.json(); 
    const sql = getSql();

    const users = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
    const userId = users[0]?.id;

    await sql`
      UPDATE user_books 
      SET status = ${status} 
      WHERE user_id = ${userId} AND book_id = ${bookId}
    `;

    return NextResponse.json({ message: "Статус оновлено" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}