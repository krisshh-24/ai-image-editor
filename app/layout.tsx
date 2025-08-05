import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {ClerkProvider} from '@clerk/nextjs'
import { dark, neobrutalism } from '@clerk/themes'

const IBM_Plex = IBM_Plex_Sans({
  variable: "--font-ibm_plex",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "sxsxc",
  description: "AI Powered Image Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
    afterSignOutUrl={'/'}
    appearance={{
      baseTheme: [dark, neobrutalism],
    }}>
      <html lang="en">
        <body className={cn("font-IBM_Plex antialiased", IBM_Plex.variable)}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
