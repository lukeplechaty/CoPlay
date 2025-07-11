import "./globals.css";

export const metadata = {
  title: "CoPlay",
  description: "Video play with frends",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
