"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { users_api } from "api/users_api";
import Loading from "components/UI/Loading/Loading";
import { useSnackbar } from "notistack";

const EXCLUDED_PATHS = ["/auth/login"];

interface IProps {
  children: React.ReactNode;
}

const AuthInitializer = ({ children }: IProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(true);

  const refreshAuthToken = async () => {
    try {
      await users_api.refresh();

      setIsLoading(false);
    } catch (error) {
      console.error("Error refreshing token:", error);
      if (!EXCLUDED_PATHS.includes(pathname)) {
        router.push("/auth/login");
      }

      enqueueSnackbar("Помилка авторизації", { variant: "error" });
    }
  };

  // TODO: костиль для відключення лоадера на сторінках авторизації (потрібно виправити)
  // TODO: це потрібно бо після реплейсу одразу відбувається відключення лоадера а реплейс ще не встигає відбутися
  useEffect(() => {
    if (EXCLUDED_PATHS.includes(pathname)) {
      setIsLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    refreshAuthToken();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return children;
};

export default AuthInitializer;
