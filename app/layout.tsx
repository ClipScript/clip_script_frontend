import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clip Script Transcript Generator",
  description: "Turn TikTok, Reels & Shorts into clean transcripts instantly.",

  metadataBase: new URL("https://www.useclipscript.com"),

  openGraph: {
    title: "Clip Script Transcript Generator",
    description:
      "Turn TikTok, Reels & Shorts into clean transcripts instantly.",
    url: "https://www.useclipscript.com",
    siteName: "ClipScript",
    images: [
      {
        url: "https://www.useclipscript.com/social-preview.png", // 👈 FULL URL (not relative)
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Clip Script Transcript Generator",
    description:
      "Turn TikTok, Reels & Shorts into clean transcripts instantly.",
    images: ["/social-preview.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      "max-image-preview": "large",
    },
  },

};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
