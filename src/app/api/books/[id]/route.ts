import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const getSql = () => {
  const connectionString = process.env.NODE_ENV === 'development' 
    ? process.env.POSTGRES_URL_DEV 
    : process.env.POSTGRES_URL;
  return neon(connectionString!);
};

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params; 
    const sql = getSql();
    
    await sql`DELETE FROM books WHERE id = ${id}`;
    
    return NextResponse.json({ message: `Книгу з id ${id} видалено` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params; 
    const { price, description } = await request.json();
    const sql = getSql();
    
    const result = await sql`
      UPDATE books 
      SET price = COALESCE(${price}, price), 
          description = COALESCE(${description}, description)
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Книгу не знайдено" }, { status: 404 });
    }
    
    return NextResponse.json(result[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}