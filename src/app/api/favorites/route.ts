import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';

const getSql = () => {
  const connectionString = process.env.POSTGRES_URL_DEV || process.env.POSTGRES_URL;
  return neon(connectionString!);
};

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json([]);
  const sql = getSql();
  const favs = await sql`
    SELECT b.* FROM books b
    JOIN favorites f ON b.id = f.book_id
    JOIN users u ON f.user_id = u.id
    WHERE u.email = ${session.user.email}
  `;
  return NextResponse.json(favs);
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { bookId } = await req.json();
  const sql = getSql();
  const users = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
  await sql`INSERT INTO favorites (user_id, book_id) VALUES (${users[0].id}, ${bookId}) ON CONFLICT DO NOTHING`;
  return NextResponse.json({ message: "Added" });
}

export async function DELETE(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { bookId } = await req.json();
  const sql = getSql();
  const users = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
  await sql`DELETE FROM favorites WHERE user_id = ${users[0].id} AND book_id = ${bookId}`;
  return NextResponse.json({ message: "Removed" });
}