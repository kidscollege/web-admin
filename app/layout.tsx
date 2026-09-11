import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import RoleRedirect from "@/components/RoleRedirect";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kids College",
  description: "first amongst equal",
  icons: {
    icon: "/kc.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RoleRedirect />
        {children}
      </body>
    </html>
  );
}
