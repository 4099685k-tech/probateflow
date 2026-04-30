import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "ProbateFlow",
  description: "Probate Real Estate Lead CRM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 text-gray-900`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}