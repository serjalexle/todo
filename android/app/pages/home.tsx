import { Background } from "@/components/ui/base/Background/Background";
import { Container } from "@/components/ui/base/Container/Container";
import { RootStackParamList } from "@/types/commom";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Text } from "react-native";

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Background>
      <Container backgroundColor="transparent">
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 50,
            color: "red",
          }}
        >
          This is the Home screen. You can add your content here.
        </Text>

        <Button
          title="Go to Login"
          onPress={() => navigation.navigate("LoginScreen")}
          color="#841584"
        />

        <Button
          title="Go to Register"
          onPress={() => navigation.navigate("RegisterScreen")}
          color="#841584"
        />
      </Container>
    </Background>
  );
}
