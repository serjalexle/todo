import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:android_app/presentation/screens/home_screen.dart';
import 'package:android_app/providers/theme_provider.dart';

/// Головний віджет програми
class App extends ConsumerWidget { // ✅ Замість StatelessWidget
  const App({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) { // ✅ Тепер можна використовувати ref
    final themeNotifier = ref.watch(themeProvider);

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Темна тема',
      theme: ThemeData.light(),
      darkTheme: ThemeData.dark(),
      themeMode: themeNotifier.isDarkMode ? ThemeMode.dark : ThemeMode.light,
      home: const HomeScreen(),
    );
  }
}
