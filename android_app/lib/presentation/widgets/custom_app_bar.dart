import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart'; // ✅ Імпорт GoRouter
import 'package:android_app/providers/auth_provider.dart';
import 'package:android_app/providers/theme_provider.dart';
import 'package:android_app/providers/locale_provider.dart';
import 'package:android_app/presentation/widgets/language_switcher.dart';

class CustomAppBar extends ConsumerWidget implements PreferredSizeWidget {
  final String title;

  const CustomAppBar({super.key, required this.title});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDarkMode = ref.watch(themeProvider);
    final themeNotifier = ref.read(themeProvider.notifier);
    final localeNotifier = ref.read(localeProvider.notifier);
    final goRouter = GoRouter.of(context); // ✅ Отримуємо GoRouter

    return AppBar(
      title: Text(title),
      centerTitle: true,
      backgroundColor: Colors.deepOrange,
      actions: [
        IconButton(
          icon: Icon(isDarkMode ? Icons.dark_mode : Icons.light_mode),
          onPressed: themeNotifier.toggleTheme,
        ),
        LanguageSwitcher(onTap: localeNotifier.toggleLanguage),
        IconButton(
          icon: const Icon(Icons.logout),
          onPressed: () {
            ref.read(authProvider.notifier).logout();
            goRouter.go('/login'); // ✅ ПРАЦЮЄ ПРАВИЛЬНО!
          },
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
