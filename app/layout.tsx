import type { Metadata } from "next";
import { Onest } from "next/font/google";

export const metadata: Metadata = {
  title: "ObjectLog",
  description: "Manage anything",
};

const onest = Onest({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-onest",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${onest.variable} h-full antialiased`}
      style={{
        backgroundColor: "#112512",
        color: "white",
        fontFamily: `var(--font-onest), sans-serif`,
      }}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
