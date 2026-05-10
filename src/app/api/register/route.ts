import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();
    const sql = neon(process.env.POSTGRES_URL_DEV || process.env.POSTGRES_URL!);

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Всі поля (ім'я, пошта, телефон та пароль) є обов'язковими!" }, 
        { status: 400 }
      );
    }

    if (phone.trim().length < 10) {
      return NextResponse.json(
        { error: "Будь ласка, введіть коректний номер телефону" }, 
        { status: 400 }
      );
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Ця пошта вже зайнята" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (name, email, phone, password)
      VALUES (${name}, ${email}, ${phone}, ${hashedPassword})
    `;

    return NextResponse.json({ message: "Користувача успішно створено" }, { status: 201 });
  } catch (err: any) {
    console.error("Помилка реєстрації:", err);
    return NextResponse.json({ error: "Помилка на стороні сервера" }, { status: 500 });
  }
}