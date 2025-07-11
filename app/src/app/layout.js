import "./globals.css";
import NavBar from "@/components_client/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { MuseoModerno, Comfortaa } from "next/font/google";

const moderno = MuseoModerno({
  variable: "--moderno",
  weight: "400",
  subsets: ["latin"],
});

const comfortaa = Comfortaa({
  variable: "--comfortaa",
  weight: "variable",
  subsets: ["latin"],
});

export const metadata = {
  title: "CoPlay",
  description: "Video play with frends",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${[comfortaa.variable, moderno.variable].join(" ")}`}>
          <NavBar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
