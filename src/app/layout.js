import "./globals.css";
import { UserAuthProvider } from "@/context/UserAuthContext";
import AdminAuthWrapper from "@/components/AdminAuthWrapper";

export const metadata = {
  title: "Starlette",
  description: "Starlette - The first MicroLagree studio in Israel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserAuthProvider>
          <AdminAuthWrapper>{children}</AdminAuthWrapper>
        </UserAuthProvider>
      </body>
    </html>
  );
}
