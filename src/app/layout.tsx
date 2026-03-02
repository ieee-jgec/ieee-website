import type { Metadata } from "next";
import { Geist, Geist_Mono, Ubuntu, Ubuntu_Mono } from "next/font/google";
// @ts-ignore: allow importing global CSS without type declarations
import "./globals.css";
// @ts-ignore: allow importing nprogress CSS without type declarations
import 'nprogress/nprogress.css';
import NavBar from "@/components/ui/navBar";
import { NavbarProvider } from "@/context/navbarContext";
import { HeaderNav } from "@/components/ui/HeaderNav";
import { Footer } from "@/components/ui/Footer";
import { StoreProvider } from "@/context/storeContext";
import LoadingProgress from "@/components/ui/PageProgressBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IEEE Student Branch JGEC",
  description: "Welcome to IEEE Student Branch JGEC — inspiring innovation, empowering learners, and building a community of tech enthusiasts at JGEC."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ubuntu} antialiased`}
      >
        <StoreProvider>
          <NavbarProvider>
            {/* Progress bar */}
            <LoadingProgress />
            {/* NavBar */}
            <HeaderNav />
            <main className="min-h-screen">
              {children}
            </main>
            <footer>
              <Footer />
            </footer>
          </NavbarProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
