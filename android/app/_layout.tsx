import { ThemeProvider } from "styled-components/native";

import "react-native-reanimated";

import Navigation from "@/components/ui/Navigation/Navigation";
import { theme } from "@/styles/theme";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Navigation />
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
}
