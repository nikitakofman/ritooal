import "./globals.css";
import Modal from "@/components/Modal";

export const metadata = {
  title: "Ritooal",
  description: "Simple task manager to help handle your daily activies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FFFDFC]">
        {children}
        <Modal />
      </body>
    </html>
  );
}
