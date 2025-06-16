import { login } from "@/api/auth.route";
import { Background } from "@/components/ui/base/Background/Background";
import { Container } from "@/components/ui/base/Container/Container";
import GradientButton from "@/components/ui/base/GradientButton/GradientButton";
import StandardInput from "@/components/ui/base/StyledInput/StyledInput";
import LoginTitle from "@/components/ui/login/LoginTitle";
import { theme } from "@/styles/theme";
import { authTokens } from "@/utils/authTokenStorage";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import styledDefault from "styled-components/native";

import { useNavigation } from "@react-navigation/native";

const Link = styledDefault.Text`
  color: #6200ee;
  text-align: center;
  margin-top: 16px;
`;

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { save } = authTokens;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await login({ email, password });

      console.log("✅ Login success:", response);

      await save({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      });

      Toast.show({
        type: "success",
        text1: "Успішний вхід",
        text2: "Вітаємо у системі!",
      });

      // Перехід на домашній екран або інше
      navigation.navigate("Home" as never);
    } catch (error: any) {
      console.error("❌ Login error:", error?.response?.data || error);
      Toast.show({
        type: "error",
        text1: "Помилка входу",
        text2: error?.response?.data?.message || "Невірна пошта або пароль",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <Container backgroundColor="transparent">
        <LoginTitle>Вхід до системи</LoginTitle>

        <StandardInput
          placeholder="Email"
          value={email}
          error={!email.includes("@") ? "Некоректна пошта" : undefined}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <StandardInput
          placeholder="Пароль"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={!isPasswordVisible}
          rightIcon={
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color={theme.colors.text}
            />
          }
          onRightIconPress={() => setIsPasswordVisible((prev) => !prev)}
          fullWidth
        />

        <GradientButton
          title={loading ? "Завантаження..." : "Увійти"}
          onPress={handleLogin}
          disabled={loading}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("Register" as never)}
        >
          <Link>Немає акаунту? Зареєструватись</Link>
        </TouchableOpacity>
      </Container>
    </Background>
  );
};

export default LoginScreen;
