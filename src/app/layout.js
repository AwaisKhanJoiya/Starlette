import "./globals.css";
import { UserAuthProvider } from "@/context/UserAuthContext";
import AdminAuthWrapper from "@/components/AdminAuthWrapper";
import { Bounce, ToastContainer } from "react-toastify";
import axios from "axios";

export const metadata = {
  title: "Starlette",
  description: "Starlette - The first MicroLagree studio in Israel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserAuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
          <AdminAuthWrapper>{children}</AdminAuthWrapper>
        </UserAuthProvider>
      </body>
    </html>
  );
}
