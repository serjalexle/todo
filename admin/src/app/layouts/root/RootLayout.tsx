import type { Metadata } from "next";

import { IChildren } from "@/app/types/global";

import "@/app/styles/index.css";

interface IProps {
  children: IChildren;
}

export const metadata: Metadata = {
  title: "Link-Shortify",
  description: "Link-Shortify description",
};

const RootLayout = async ({ children }: Readonly<IProps>) => {
  return (
    <html
      lang="en"
      // suppressHydrationWarning
    >
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
