import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.nextjsapp",
  appName: "NextJSApp",
  webDir: "out", // Вказуємо папку білду Next.js
  bundledWebRuntime: false,
};

export default config;
