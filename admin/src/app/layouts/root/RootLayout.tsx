import type { Metadata } from "next";

import { IChildren } from "@/app/types/global";

import { PageWrapper } from "@/app/wrappers/PageWrapper";

import "@/app/styles/index.css";

interface IProps {
  children: IChildren;
}

export const metadata: Metadata = {
  title: "I AM AN ADMIN",
  description: "I am an admin",
};

const RootLayout = async ({ children }: Readonly<IProps>) => {
  return (
    <html
      lang="en"
      // suppressHydrationWarning
    >
      <body>
        <main>
          <PageWrapper>{children}</PageWrapper>
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
