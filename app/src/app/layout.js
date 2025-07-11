import "./globals.css";
import NavBar from "@/components_client/Navbar";
export const metadata = {
  title: "CoPlay",
  description: "Video play with frends",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
