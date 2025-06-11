import { register } from "@/api/auth.route";
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

const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { save } = authTokens;

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Помилка",
        text2: "Паролі не збігаються",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        email,
        password,
      });

      console.log("✅ Response:", response);

      await save({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      });

      Toast.show({
        type: "success",
        text1: "Успіх",
        text2: "Реєстрація пройшла успішно!",
      });

      // можна одразу перекинути на логін
      navigation.navigate("HomeScreen");
    } catch (error: any) {
      console.error("❌ Register error:", error?.response?.data || error);
      Toast.show({
        type: "error",
        text1: "Помилка реєстрації",
        text2: error?.response?.data?.message || "Щось пішло не так",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <Container backgroundColor="transparent">
        <LoginTitle>Реєстрація</LoginTitle>

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

        <StandardInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={{ marginBottom: 16 }}
        >
          <Text style={{ color: "#6200ee", textAlign: "right" }}>
            {showPassword ? "Hide password" : "Show password"}
          </Text>
        </TouchableOpacity>

        <GradientButton title="Register" onPress={handleRegister} />

        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Link>Already have an account? Sign In</Link>
        </TouchableOpacity>
      </Container>
    </Background>
  );
};

export default RegisterScreen;
