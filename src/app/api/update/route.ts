import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Неавторизовано" }, { status: 401 });
    }

    const { name, phone, age } = await req.json();
    
    const sql = neon(process.env.POSTGRES_URL_DEV || process.env.POSTGRES_URL!);

    await sql`
      UPDATE users 
      SET 
        name = ${name}, 
        phone = ${phone || null}, 
        age = ${age ? parseInt(age.toString()) : null}
      WHERE email = ${session.user.email}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Детальна помилка:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}