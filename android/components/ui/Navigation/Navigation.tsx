import HomeScreen from "@/app/pages/home";
import LoginScreen from "@/app/pages/login";
import RegisterScreen from "@/app/pages/register";
import AuthWrapper from "@/components/wrappers/AuthWrapper";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

const { Navigator, Screen } = createBottomTabNavigator();

const Navigation = () => {
  return (
    <Navigator
      screenOptions={({ route }) => {
        const hideTabBar = route.name === "Login" || route.name === "Register";
        return {
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderTopWidth: 0,
            position: "absolute",
            elevation: 0,
            marginHorizontal: 10,
            borderRadius: 20,
            display: hideTabBar ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            
          },

          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home";

            if (route.name === "Home") iconName = "home";
            else if (route.name === "Login") iconName = "log-in";
            else if (route.name === "Register") iconName = "person-add";

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        };
      }}
    >
      <Screen name="Home">
        {() => (
          <AuthWrapper>
            <HomeScreen />
          </AuthWrapper>
        )}
      </Screen>
      <Screen name="Profile" component={LoginScreen} />
      <Screen name="Register" component={RegisterScreen} />
    </Navigator>
  );
};

export default Navigation;
