import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";


export const metadata: Metadata = {
  title: "LQ Imoveis",
  description: "Imobiliaria LQ",
  keywords: ['imoveis', 'imobiliaria', 'imoveis usados']
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
