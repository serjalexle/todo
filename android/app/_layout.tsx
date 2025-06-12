import { ThemeProvider } from "styled-components/native";

import "react-native-reanimated";

import AuthWrapper from "@/components/wrappers/AuthWrapper";
import { theme } from "@/styles/theme";
import { RootStackParamList } from "@/types/commom";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";
import HomeScreen from "./pages/home";
import LoginScreen from "./pages/login";
import RegisterScreen from "./pages/register";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
          gestureEnabled: true,
          animationDuration: 100,
        }}
      >
        <Stack.Screen name="HomeScreen">
          {() => (
            <AuthWrapper>
              <HomeScreen />
            </AuthWrapper>
          )}
        </Stack.Screen>

        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      </Stack.Navigator>

      <Toast
        config={{
          success: ({ text1, text2, ...rest }) => (
            <View
              style={{
                padding: 12,
                backgroundColor: theme.colors.primary,
                borderRadius: 8,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {text1}
              </Text>
              {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
            </View>
          ),
        }}
      />
    </ThemeProvider>
  );
};

export default RootLayout;
