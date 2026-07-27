import { Courier_Prime, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata = {
  title: "The Daily Tab — food log",
  description: "A receipt for everything you ate today.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
