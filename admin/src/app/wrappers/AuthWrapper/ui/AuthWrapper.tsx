// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

import { IChildren } from "@/app/types/global";

interface IProps {
  children: IChildren;
}

const AuthWrapper = ({ children }: Readonly<IProps>) => {
  // TODO: check if user is authenticated
//   const router = useRouter();

  //   useEffect(() => {
  //     console.log("AuthWrapper");
  //     const isAuthenticated = false;

  //     if (!isAuthenticated) {
  //       router.push("/auth");
  //     }
  //   }, []);

  return <>{children}</>;
};

export default AuthWrapper;
