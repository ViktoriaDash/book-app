import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connectionString = process.env.NODE_ENV === 'development' 
      ? process.env.POSTGRES_URL_DEV 
      : process.env.POSTGRES_URL;

    if (!connectionString) {
      throw new Error("Рядок підключення не знайдено!");
    }

    const sql = neon(connectionString);

    await sql`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        description TEXT
      );
    `;

    await sql`
      INSERT INTO books (title, author, price, description)
      VALUES 
        ('Величний Гетсбі', 'Ф. Скотт Фіцджеральд', 250),
        ('1984', 'Джордж Орвелл', 210),
        ('Маленький принц', 'Антуан де Сент-Екзюпері', 180)
      ON CONFLICT DO NOTHING;
    `;

    return NextResponse.json({ 
      message: "Seed виконано!", 
      using_database: process.env.NODE_ENV === 'development' ? "book_app_dev" : "neondb"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}