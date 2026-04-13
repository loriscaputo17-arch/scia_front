// layout.tsx o layout.js
import { Geist, Geist_Mono, Barlow } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlow = Barlow({ subsets: ["latin"], weight: "500" });

// ✅ Titolo e descrizione restano qui
export const metadata = {
  title: "Wake",
  description: "Wake App",
  icons: {
    icon: "/favicon.ico",
  },
};

// ✅ Viewport spostato qui, come export a parte
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        style={{ background: "#001c38" }}
        className={barlow.className}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
