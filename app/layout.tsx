import "./globals.css";

export const metadata = {
  title: {
    default: "Propoye — Buy Property in India | 0% Brokerage",
    template: "%s | Propoye",
  },
  description:
    "India's trusted real estate platform. Buy verified flats & apartments across Mumbai, Pune, Navi Mumbai and 10+ cities. Zero brokerage. Expert guidance.",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://www.propoye.com"),
  alternates: {
    canonical: "https://www.propoye.com",
  },
  openGraph: {
    title: "Propoye — Buy Property in India | 0% Brokerage",
    description: "Find verified flats & apartments across 10+ Indian cities. Zero brokerage.",
    siteName: "Propoye",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Propoye — Buy Property in India | 0% Brokerage",
    description: "Verified properties across India. 0% brokerage. Expert guidance at every step.",
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