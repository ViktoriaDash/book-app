import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Підключення до бази (використовуємо твій робочий ключ)
const getSql = () => {
  const connectionString = process.env.POSTGRES_URL_DEV || process.env.POSTGRES_URL;
  if (!connectionString) throw new Error("Database URL is missing");
  return neon(connectionString);
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author, price, image_url, description } = body;

    const sql = getSql();

    // Записуємо нову книгу в таблицю books
    await sql`
      INSERT INTO books (title, author, price, image_url, description)
      VALUES (${title}, ${author}, ${Number(price)}, ${image_url}, ${description})
    `;

    return NextResponse.json(
      { message: "Книга успішно додана!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Помилка при створенні книги:", error);
    return NextResponse.json(
      { error: "Не вдалося додати книгу в базу даних" },
      { status: 500 }
    );
  }
}