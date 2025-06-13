import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import { Toaster } from "sonner";


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
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
