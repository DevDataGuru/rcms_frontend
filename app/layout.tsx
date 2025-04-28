"use client";
import ProviderComponent from "@/components/layouts/provider-component";
import "react-perfect-scrollbar/dist/css/styles.css";
import "../styles/tailwind.css";
import { Nunito } from "next/font/google";
import "@progress/kendo-theme-default/dist/all.css";
import { Provider } from "react-redux";
import store from "@/store";
import "remixicon/fonts/remixicon.css";
import { SessionProvider } from "next-auth/react";
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import "react-dropzone-uploader/dist/styles.css";
import 'tippy.js/dist/tippy.css';


const nunito = Nunito({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={nunito.variable}>
        <SessionProvider>
          <Provider store={store}>
            <ProviderComponent>{children}</ProviderComponent>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
