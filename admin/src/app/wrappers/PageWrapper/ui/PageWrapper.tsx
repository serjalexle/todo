import { IChildren } from "@/app/types/global";

import { ThemeWrapper } from "@/app/wrappers/ThemeWrapper";
// import { AuthWrapper } from "@/app/wrappers/AuthWrapper";

interface IProps {
  children: IChildren;
}

const PageWrapper = ({ children }: Readonly<IProps>) => {
  return (
    // <AuthWrapper>
      <ThemeWrapper>{children}</ThemeWrapper>
    // </AuthWrapper>
  );
};

export default PageWrapper;
