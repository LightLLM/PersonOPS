import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "PersonaOps",
  description: "Control plane for production AI personas on DigitalOcean Gradient AI."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}

