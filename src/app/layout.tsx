import "./globals.css";
import { Providers } from "@/components/Providers"; // Імпортуємо наш провайдер сесії

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}