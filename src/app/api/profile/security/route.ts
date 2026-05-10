import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Неавторизовано" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();
    const sql = neon(process.env.POSTGRES_URL_DEV || process.env.POSTGRES_URL!);

    const users = await sql`SELECT password FROM users WHERE email = ${session.user.email}`;
    const user = users[0];

    if (!user.password) {
      return NextResponse.json({ 
        error: "Ви увійшли через Google/GitHub. У вас немає пароля в нашій базі." 
      }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Поточний пароль вказано невірно" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await sql`UPDATE users SET password = ${hashedPassword} WHERE email = ${session.user.email}`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}