import Head from "next/head";
import "./globals.css";
import Modal from "@/components/Modal";

export const metadata = {
  title: "Ritooal",
  description: "Simple task manager to help handle your daily activities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta
          name="Simple task manager to help handle your daily activities."
          content={metadata.description}
        />
        <link rel="icon" href="/favicon.ico" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.ritooal.com/" />
        <meta property="og:title" content="Ritooal" />
        <meta
          property="og:description"
          content="Simple task manager to help handle your daily activities."
        />
        <meta
          property="og:image"
          content="https://www.nikitakofman.com/ritooalweb.png"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.ritooal.com/" />
        <meta property="twitter:title" content="Ritooal" />
        <meta
          property="twitter:description"
          content="Simple task manager to help handle your daily activities."
        />
        <meta
          property="twitter:image"
          content="https://www.nikitakofman.com/ritooalweb.png"
        />
      </Head>
      <body className="bg-[#FFFDFC]">
        {children}
        <Modal />
      </body>
    </html>
  );
}
