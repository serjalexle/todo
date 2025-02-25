import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:android_app/core/app.dart';
import 'package:android_app/data/services/notifications_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await NotificationsService.init(); // Ініціалізуємо сповіщення

  // Отримуємо останню вибрану тему
  final prefs = await SharedPreferences.getInstance();
  final isDarkMode = prefs.getBool("isDarkMode") ?? false;

  runApp(
    ProviderScope(
      overrides: [
        themeProvider.overrideWith((ref) => ThemeNotifier(isDarkMode)),
      ],
      child: const App(),
    ),
  );
}
