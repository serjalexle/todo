import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:android_app/providers/theme_provider.dart';
import 'package:android_app/providers/locale_provider.dart';
import 'package:android_app/controllers/logout_controller.dart';
import 'package:android_app/presentation/widgets/language_switcher.dart';

class CustomAppBar extends ConsumerWidget implements PreferredSizeWidget {
  final String title;

  const CustomAppBar({super.key, required this.title});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = ref.watch(themeProvider);
    final themeNotifier = ref.read(themeProvider.notifier);
    final localeNotifier = ref.read(localeProvider.notifier);

    return AppBar(
      title: Text(title),
      centerTitle: true,
      backgroundColor: theme.scaffoldBackgroundColor,
      actions: [
        IconButton(
          icon: Icon(
            theme.brightness == Brightness.dark
                ? Icons.dark_mode
                : Icons.light_mode,
          ),
          onPressed: () => themeNotifier.toggleTheme(),
        ),
        LanguageSwitcher(
          onTap: () => localeNotifier.toggleLanguage(),
        ),
        IconButton(
          icon: const Icon(Icons.logout),
          onPressed: () => logout(context, ref), // ✅ Виклик `logout`
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
