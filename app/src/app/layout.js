import "./globals.css";
import NavBar from "@/components_client/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "CoPlay",
  description: "Video play with frends",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <NavBar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
