import "./globals.css";
import { ToastProvider } from "../Components/toast";

export const metadata = {
  title: "Worklytics",
  description: "Worklytics",
  icons: {
    icon: "/vectorAILogo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ToastProvider>
        {children}
        </ToastProvider>
      </body>
    </html>
  );
}
