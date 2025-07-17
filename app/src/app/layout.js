import "./globals.css";
import NavBar from "@/components_client/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { MuseoModerno, Comfortaa } from "next/font/google";
import { shadesOfPurple } from "@clerk/themes";

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
    <ClerkProvider
      appearance={{
        baseTheme: [shadesOfPurple],
        variables: {
          colorPrimary: "#e3e972",
          fontFamily: "MuseoModerno",
          colorBackground: "#6967adaa",
          colorInput: "#6967ad",
          colorInputForeground: "#081221",
        },
      }}
    >
      <html lang="en">
        <body className={`${[comfortaa.variable, moderno.variable].join(" ")}`}>
          <NavBar />
          <div className="mt-6">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
