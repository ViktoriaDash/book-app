import { neon } from '@neondatabase/serverless';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BookClientView from './BookClientView'; 

async function getBookData(id: string) {
  if (isNaN(Number(id))) {
    return null;
  }

  const connectionString = process.env.NODE_ENV === 'development' 
    ? process.env.POSTGRES_URL_DEV 
    : process.env.POSTGRES_URL;

  if (!connectionString) throw new Error("Connection string is missing");

  const sql = neon(connectionString);

  try {
    const book = await sql`SELECT * FROM books WHERE id = ${id}`;
    
    if (book.length === 0) return null;

    const reviews = await sql`SELECT * FROM reviews WHERE book_id = ${id} ORDER BY created_at DESC`;
    const avgRating = await sql`SELECT AVG(rating) as average FROM reviews WHERE book_id = ${id}`;

    return {
      book: book[0],
      reviews: reviews,
      rating: parseFloat(avgRating[0]?.average || 0).toFixed(1) 
    };
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}

export default async function ArticleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  
  if (id === 'favorite' || isNaN(Number(id))) {
    notFound();
  }

  const data = await getBookData(id);

  if (!data || !data.book) {
    notFound();
  }

  const isEbook = data.book.is_ebook;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans">
      <div className="mb-8">
        <Link 
          href={isEbook ? "/ebooks" : "/articles"} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-[#350846] transition-all duration-300 font-black text-[10px] tracking-[0.2em] uppercase"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          {isEbook ? "Електронна бібліотека" : "Каталог паперових книг"}
        </Link>
      </div>

      <BookClientView 
        book={data.book} 
        initialReviews={data.reviews} 
        averageRating={data.rating} 
      />
    </div>
  );
}