import { ThemeProvider } from "styled-components/native";

import "react-native-reanimated";

import AuthWrapper from "@/components/wrappers/AuthWrapper";
import { theme } from "@/styles/theme";
import { RootStackParamList } from "@/types/commom";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

      <Toast />
    </ThemeProvider>
  );
};

export default RootLayout;
