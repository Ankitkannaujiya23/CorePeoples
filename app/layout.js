import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "VoteDesk — Employee of the Month, done right",
  description:
    "A simple, private and engaging way for organizations to recognize their employees and celebrate the people who make a difference.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-ink-900 bg-surface-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
