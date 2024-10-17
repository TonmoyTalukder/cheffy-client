import "@/src/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { siteConfig } from "@/src/config/site";
import { fontSans } from "@/src/config/fonts";

import { Providers } from "../lib/Providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {children}

          {/* <footer className="w-full flex items-center justify-center py-3 border-1 relative">
            <span className="text-default-600">
              Cheffy ©{new Date().getFullYear()} | Developed by &nbsp;
            </span>
            <Link
              isExternal
              className="flex items-center gap-1 text-current"
              href="https://tonmoytalukder.github.io/"
              style={{ color: "#daa611", textDecoration: "underline" }}
              title="Tonmoy Talukder Portfolio Website"
            >
              <p>Tonmoy Talukder</p>
            </Link>
          </footer> */}
        </Providers>
      </body>
    </html>
  );
}
