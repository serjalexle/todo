import { refreshToken } from "@/api/auth.route";
import { authTokens } from "@/utils/authTokenStorage";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";

type Props = {
  children: React.ReactNode;
};

const AuthWrapper: React.FC<Props> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { getRefresh, getAccess, save } = authTokens;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const refresh = await getRefresh();
        const access = await getAccess();

        // console.log("🔍 Checking auth:", { refresh, access });

        if (!refresh || !access) {
          throw new Error("Missing tokens");
        }

        const response = await refreshToken();

        if (!response?.data?.access_token || !response?.data?.refresh_token) {
          throw new Error("Invalid refresh response");
        }

        // console.log("🔁 AuthWrapper: Token refreshed successfully");
        await save({
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        });
      } catch (error) {
        console.error("❌ AuthWrapper: Not authenticated", error);
        Toast.show({
          type: "error",
          text1: "Сесія завершена",
          text2: "Будь ласка, увійдіть знову",
        });

        navigation.navigate("LoginScreen");
      } finally {
        setChecking(false);
      }
    };

    if (route.name === "LoginScreen" || route.name === "RegisterScreen") {
      setChecking(false);
      return;
    }

    checkAuth();
  }, []);

  if (checking) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
