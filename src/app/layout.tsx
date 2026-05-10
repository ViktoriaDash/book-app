import "./globals.css";
import { Providers } from "@/components/Providers"; 

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

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