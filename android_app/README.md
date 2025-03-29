# android_app

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

```sh
# Reinstall dependencies and run
clear 
flutter clean 
flutter pub get 
flutter gen-l10n
flutter run
```

```sh
# Build apk file
clear
flutter clean
flutter pub get
flutter gen-l10n
flutter build apk --release --dart-define=API_BASE_URL=https://557a-93-175-201-180.ngrok-free.app
# flutter build apk --release

# Copy .apk to project root
cp build/app/outputs/flutter-apk/app-release.apk ./app-release.apk
# 📌 If you're on Windows (Git Bash, PowerShell, CMD), use:
copy build\app\outputs\flutter-apk\app-release.apk app-release.apk
```

```sh
# By default, flutter build apk --release generates a fat APK supporting all processors.
# But if you need an optimized .apk for the Play Store, split by architectures:
flutter build apk --split-per-abi
# This will generate three .apk files in:
build/app/outputs/flutter-apk/
 ├── app-arm64-v8a-release.apk   ✅ For newer devices (best option)
 ├── app-armeabi-v7a-release.apk ✅ For older devices
 ├── app-x86_64-release.apk      ✅ For emulators and x86 processors
# 📌 Recommended: use app-arm64-v8a-release.apk, as most phones are now ARM64.
```

```sh
# If you need .aab for Play Store
```

```sh
# If you want to publish the app on Google Play, use .aab instead of .apk:

flutter build appbundle

# This will create .aab in:
build/app/outputs/bundle/release/app-release.aab

# Copy .aab to project root
cp build/app/outputs/bundle/release/app-release.aab ./app-release.aab

# 📌 If you're on Windows (Git Bash, PowerShell, CMD), use:
copy build\app\outputs\bundle\release\app-release.aab app-release.aab
```
