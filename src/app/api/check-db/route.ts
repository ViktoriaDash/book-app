import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    
    const connectionString = isDev 
      ? process.env.POSTGRES_URL_DEV 
      : process.env.POSTGRES_URL;

    if (!connectionString) {
      throw new Error("Рядок підключення не знайдено в .env.local");
    }

    const sql = neon(connectionString);
    const rows = await sql`SELECT current_database(), now();`;
    
    console.log(`✅ Підключено до ${isDev ? 'DEV' : 'PROD'} бази:`, rows[0].current_database);

    return NextResponse.json({ 
      status: "Connected", 
      mode: isDev ? "Development" : "Production",
      database: rows[0].current_database,
      time: rows[0].now 
    });
  } catch (error: any) {
    console.error("❌ Помилка підключення:", error.message);
    return NextResponse.json({ 
        error: "Connection failed", 
        details: error.message 
    }, { status: 500 });
  }
}