import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Неавторизовано" }, { status: 401 });
    }

    const { name, email, phone } = await req.json(); 
    
    if (!phone || phone.trim().length < 10) {
      return NextResponse.json({ error: "Номер телефону є обов'язковим" }, { status: 400 });
    }

    const sql = neon(process.env.POSTGRES_URL_DEV || process.env.POSTGRES_URL!);

    await sql`
      UPDATE users 
      SET 
        name = ${name}, 
        email = ${email},
        phone = ${phone}
      WHERE email = ${session.user.email}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}