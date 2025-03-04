import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:android_app/providers/theme_provider.dart';
import 'package:android_app/providers/locale_provider.dart';
import 'package:android_app/config/router.dart';

class App extends ConsumerWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = ref.watch(themeProvider); // Тепер правильно отримуємо ThemeData
    final locale = ref.watch(localeProvider);
    final router = ref.watch(routerProvider); // Отримуємо GoRouter

    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      theme: theme, // Використовуємо тему, що повертається з themeProvider
      locale: locale,
      supportedLocales: AppLocalizations.supportedLocales, // Правильний імпорт
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      routerConfig: router, // Додаємо маршрутизацію
    );
  }
}
