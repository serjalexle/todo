import { login } from "@/api/auth.route";
import { Background } from "@/components/ui/base/Background/Background";
import { Container } from "@/components/ui/base/Container/Container";
import GradientButton from "@/components/ui/base/GradientButton/GradientButton";
import StandardInput from "@/components/ui/base/StyledInput/StyledInput";
import LoginTitle from "@/components/ui/login/LoginTitle";
import { authTokens } from "@/utils/authTokenStorage";
import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import styled from "styled-components/native";

const Link = styled.Text`
  color: #6200ee;
  text-align: center;
  margin-top: 16px;
`;

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      navigation.navigate("HomeScreen");
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
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <StandardInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={{ marginBottom: 16 }}
        >
          <Text style={{ color: "#6200ee", textAlign: "right" }}>
            {showPassword ? "Сховати пароль" : "Показати пароль"}
          </Text>
        </TouchableOpacity>

        <GradientButton
          title={loading ? "Завантаження..." : "Увійти"}
          onPress={handleLogin}
          disabled={loading}
        />

        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <Link>Немає акаунту? Зареєструватись</Link>
        </TouchableOpacity>
      </Container>
    </Background>
  );
};

export default LoginScreen;
