import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { theme } from "../components/theme";

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
        backgroundColor: `${theme.BACKGROUND_COLOR}`,
        color: `${theme.PRIMARY_200}`,
        fontFamily: `var(--font-onest), sans-serif`,
      }}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
