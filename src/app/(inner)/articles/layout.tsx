'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const articleLinks = [
    { name: '❤️ Улюблені', href: '/articles/favorite' },
    { name: 'Додати нову', href: '/articles/create', hasPlus: true },
  ];

  return (
    <div className="flex">
      {/* Бокове меню для статей та улюблених [cite: 27, 28] */}
      <aside className="w-60 bg-gray-100 border-r p-6 min-h-[calc(100vh-64px)]">
        <ul className="space-y-4">
          {articleLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-500'}
              >
                {link.hasPlus && <span className="text-green-600 font-bold mr-1">+</span>}
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}