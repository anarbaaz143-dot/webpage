import "./globals.css";

export const metadata = {
  title: "Propoye",
  description: "India’s trusted real estate platform",
  icons: {
    icon: "/favicon2.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}