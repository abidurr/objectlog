import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ObjectLog",
  description: "Manage anything",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
      style={{
        backgroundColor: "#112512",
        color: "white",
        fontFamily: "Onest, sans-serif",
      }}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
