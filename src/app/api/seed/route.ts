import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connectionString = process.env.NODE_ENV === 'development' 
      ? process.env.POSTGRES_URL_DEV 
      : process.env.POSTGRES_URL;
    const sql = neon(connectionString!);

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone TEXT,
        age INTEGER,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        price INTEGER DEFAULT 0,
        description TEXT,
        image_url TEXT,
        category VARCHAR(100),
        year_published INTEGER DEFAULT 2024,
        pages_count INTEGER DEFAULT 300,
        cover_type VARCHAR(50) DEFAULT 'Тверда',
        language VARCHAR(50) DEFAULT 'Українська',
        is_ebook BOOLEAN DEFAULT FALSE
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_books (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'want_to_read',
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, book_id)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        user_name VARCHAR(100) NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`TRUNCATE TABLE books RESTART IDENTITY CASCADE;`;

    await sql`
      INSERT INTO books (title, author, price, description, image_url, category, year_published, pages_count, cover_type, language, is_ebook)
      VALUES 
        ('Джерело', 'Ден Браун', 350, 'Роберт Ленґдон розгадує таємниці в Більбао.', '/books/get.jpeg', 'Трилер', 2018, 528, 'Тверда', 'Українська', FALSE),
        ('Колапс', 'Макс Кідрук', 300, 'Масштабна сага про майбутнє та колонізацію Марса.', '/books/colaps.jpeg', 'Фантастика', 2023, 904, 'Тверда', 'Українська', FALSE),
        ('Опівнічні діти', 'Салман Рушді', 470, 'Магічний реалізм про долю Саліма Сіная.', '/books/night.jpeg', 'Магічний реалізм', 2016, 704, 'Тверда', 'Українська', FALSE),
        ('Історії з хорошим кінцем', 'Ірена Карпа', 400, 'Іронічні есеї про життя в Парижі.', '/books/history not bad end.jpeg', 'Есеїстика', 2022, 280, 'Тверда', 'Українська', FALSE),
        ('Століття таємниць', 'Михайло Чорнописький', 320, 'Минуле переплітається з сучасністю.', '/books/sentry.jpeg', 'Роман', 2021, 350, 'Тверда', 'Українська', FALSE),
        ('Атомні звички', 'Джеймс Клір', 450, 'Маленькі зміни, що дають колосальні результати.', '/books/antony.jpeg', 'Психологія', 2020, 304, 'Тверда', 'Українська', FALSE),
        ('Психологія впливу', 'Роберт Чалдіні', 400, 'Шість принципів переконання та маніпуляції.', '/books/psycho.jpeg', 'Психологія', 2021, 368, 'Тверда', 'Українська', FALSE),
        ('Людина в пошуках справжнього сенсу', 'Віктор Франкл', 350, 'Досвід виживання в концтаборах.', '/books/human.jpeg', 'Психологія', 2022, 160, 'Тверда', 'Українська', FALSE),
        ('Алхімік', 'Пауло Коельйо', 270, 'Подорож пастуха Сантьяго за скарбами.', '/books/alh.jpeg', 'Філософія', 2023, 192, 'Тверда', 'Українська', FALSE),
        ('Відьмак: Останнє бажання', 'Анджей Сапковський', 450, 'Майстер меча полює на монстрів.', '/books/witch.jpeg', 'Фентезі', 2016, 288, 'Тверда', 'Українська', FALSE),
        ('Четверте крило', 'Ребекка Яррос', 400, 'Академія вершників драконів.', '/books/wing.jpeg', 'Фентезі', 2024, 600, 'Тверда', 'Українська', FALSE),
        ('Величний Гетсбі', 'Ф. Скотт Фіцджеральд', 329, 'Історія про американську мрію та кохання.', '/books/big.jpeg', 'Класика', 2021, 224, 'Тверда', 'Українська', FALSE),
        ('Маленький принц', 'Антуан де Сент-Екзюпері', 200, 'Казка про відповідальність та дружбу.', '/books/small.jpeg', 'Дитячі', 2019, 128, 'Тверда', 'Українська', FALSE),
        ('Двір шипів і троянд', 'Сара Джанет Маас', 559, 'Фейра в полоні у безсмертного фейрі.', '/books/rose.jpeg', 'Фентезі', 2024, 544, 'Тверда', 'Українська', FALSE),
        -- Твої нові електронні книги (is_ebook = TRUE, ціна 0)
        ('Grave Empire', 'Richard Swan', 0, 'Імперія без магії стикається з некромантами.', '/books/grave.jpg', 'Темне фентезі', 2023, 470, 'E-Book', 'Англійська', TRUE),
        ('The Knight and the Moth', 'Rachel Gillig', 0, 'Готична історія про провидиць і таємниці.', '/books/knight.jpg', 'Готичне фентезі', 2024, 460, 'E-Book', 'Англійська', TRUE),
        ('Тінь мертвого бога', 'Ярослав Шевченко', 0, 'Темне фентезі зі слов’янською міфологією.', '/books/god.jpg', 'Фентезі', 2024, 300, 'E-Book', 'Українська', TRUE),
        ('Shadow and Bone', 'Leigh Bardugo', 0, 'Дівчина відкриває силу, здатну врятувати світ.', '/books/shadow.jpg', 'Фентезі', 2021, 350, 'E-Book', 'Англійська', TRUE),
        ('Володар перснів: Братство Персня', 'Джон Р. Р. Толкін', 0, 'Класична історія про подорож та кільце влади.', '/books/ring.jpg', 'Фентезі', 2020, 450, 'E-Book', 'Українська', TRUE)
    `;

    return NextResponse.json({ message: "База успішно заповнена книгами з папки public!" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}